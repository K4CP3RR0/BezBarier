import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants.js';
import type { DrizzleDb } from '../database/database.types.js';
import {
  barrierCategories,
  barriers,
  barrierStatuses,
  barrierVerifications,
} from '../database/schema.js';

export type CreateBarrierInput = {
  categoryCode: string;
  description: string;
  lat: number;
  lng: number;
  source?: 'VOICE' | 'MANUAL' | 'PHOTO';
  isTemporary?: boolean;
  expiresAt?: string | null;
  gpsAccuracyM?: number | null;
  userId: string;
};

export type CreateVerificationInput = {
  barrierId: string;
  userId: string;
  action: 'CONFIRM' | 'DENY' | 'RESOLVED';
  note?: string | null;
  photoStorageKey?: string | null;
};

@Injectable()
export class BarriersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  listCategories() {
    return this.db.select().from(barrierCategories);
  }

  listStatuses() {
    return this.db.select().from(barrierStatuses);
  }

  async listNearby(lat: number, lng: number, radiusMeters = 500) {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new BadRequestException('lat and lng are required numbers');
    }

    const result = await this.db.execute(sql`
      SELECT
        b.id,
        b.description,
        b.source,
        b.is_temporary,
        b.expires_at,
        b.created_at,
        b.updated_at,
        c.code AS category_code,
        c.name AS category_name,
        s.code AS status_code,
        s.name AS status_name,
        ST_Y(b.location::geometry) AS lat,
        ST_X(b.location::geometry) AS lng
      FROM barriers b
      JOIN barrier_categories c ON c.id = b.category_id
      JOIN barrier_statuses s ON s.id = b.status_id
      WHERE b.deactivated_at IS NULL
        AND ST_DWithin(
          b.location,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
          ${radiusMeters}
        )
      ORDER BY b.created_at DESC
      LIMIT 200
    `);

    return result.rows;
  }

  async getById(id: string) {
    const result = await this.db.execute(sql`
      SELECT
        b.id,
        b.description,
        b.source,
        b.is_temporary,
        b.expires_at,
        b.created_at,
        b.updated_at,
        b.reported_by_user_id,
        c.code AS category_code,
        c.name AS category_name,
        s.code AS status_code,
        s.name AS status_name,
        ST_Y(b.location::geometry) AS lat,
        ST_X(b.location::geometry) AS lng
      FROM barriers b
      JOIN barrier_categories c ON c.id = b.category_id
      JOIN barrier_statuses s ON s.id = b.status_id
      WHERE b.id = ${id}::uuid
      LIMIT 1
    `);

    const row = result.rows[0];
    if (!row) throw new NotFoundException('Barrier not found');
    return row;
  }

  async create(input: CreateBarrierInput) {
    const {
      categoryCode,
      description,
      lat,
      lng,
      userId,
      source = 'MANUAL',
      isTemporary = false,
      expiresAt = null,
      gpsAccuracyM = null,
    } = input;

    if (!description?.trim()) {
      throw new BadRequestException('description is required');
    }
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new BadRequestException('lat and lng are required numbers');
    }
    if (isTemporary && !expiresAt) {
      throw new BadRequestException('expiresAt is required when isTemporary=true');
    }

    const [category] = await this.db
      .select()
      .from(barrierCategories)
      .where(eq(barrierCategories.code, categoryCode))
      .limit(1);
    if (!category) {
      throw new BadRequestException(`Unknown categoryCode: ${categoryCode}`);
    }

    const [status] = await this.db
      .select()
      .from(barrierStatuses)
      .where(eq(barrierStatuses.code, 'REPORTED'))
      .limit(1);
    if (!status) {
      throw new BadRequestException('Status REPORTED missing — run db:seed');
    }

    const near = await this.db.execute(sql`
      SELECT id
      FROM barriers
      WHERE deactivated_at IS NULL
        AND category_id = ${category.id}::uuid
        AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
          10
        )
      LIMIT 1
    `);
    if (near.rows[0]) {
      throw new ConflictException('Similar barrier already exists within 10m');
    }

    const inserted = await this.db.execute(sql`
      INSERT INTO barriers (
        category_id,
        status_id,
        reported_by_user_id,
        description,
        location,
        gps_accuracy_m,
        source,
        is_temporary,
        expires_at
      ) VALUES (
        ${category.id}::uuid,
        ${status.id}::uuid,
        ${userId},
        ${description.trim()},
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${gpsAccuracyM},
        ${source}::barrier_source,
        ${isTemporary},
        ${expiresAt}
      )
      RETURNING id
    `);

    const id = inserted.rows[0]?.id as string | undefined;
    if (!id) throw new BadRequestException('Failed to create barrier');
    return this.getById(id);
  }

  async createVerification(input: CreateVerificationInput) {
    const { barrierId, userId, action, note = null, photoStorageKey = null } =
      input;

    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }

    await this.getById(barrierId);

    try {
      const [row] = await this.db
        .insert(barrierVerifications)
        .values({
          barrierId,
          userId,
          action,
          note,
          photoStorageKey,
        })
        .returning();

      if (action === 'CONFIRM') {
        const [confirmed] = await this.db
          .select()
          .from(barrierStatuses)
          .where(eq(barrierStatuses.code, 'CONFIRMED'))
          .limit(1);
        if (confirmed) {
          await this.db
            .update(barriers)
            .set({
              statusId: confirmed.id,
              confirmedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(barriers.id, barrierId));
        }
      }

      if (action === 'RESOLVED') {
        const [resolved] = await this.db
          .select()
          .from(barrierStatuses)
          .where(eq(barrierStatuses.code, 'RESOLVED'))
          .limit(1);
        if (resolved) {
          await this.db
            .update(barriers)
            .set({
              statusId: resolved.id,
              deactivatedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(barriers.id, barrierId));
        }
      }

      return row;
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error && 'code' in error
          ? String((error as { code?: string }).code)
          : '';
      if (code === '23505') {
        throw new ConflictException('Verification already exists for this action');
      }
      throw error;
    }
  }

  listVerifications(barrierId: string) {
    return this.db
      .select()
      .from(barrierVerifications)
      .where(eq(barrierVerifications.barrierId, barrierId));
  }
}