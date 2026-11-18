import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { BarriersService } from '../barriers/barriers.service.js';
import { DRIZZLE } from '../database/database.constants.js';
import type { DrizzleDb } from '../database/database.types.js';
import { voiceNotes } from '../database/schema.js';

export type CreateVoiceNoteInput = {
  barrierId: string;
  userId: string;
  transcriptionText: string;
  rawTranscript?: string | null;
  audioStorageKey?: string | null;
  lat?: number | null;
  lng?: number | null;
};

@Injectable()
export class VoiceNotesService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
    private readonly barriers: BarriersService,
  ) {}

  async create(input: CreateVoiceNoteInput) {
    const transcriptionText = input.transcriptionText?.trim();
    if (!transcriptionText) {
      throw new BadRequestException('transcriptionText is required');
    }
    if (!input.userId) {
      throw new BadRequestException('Authentication required');
    }

    await this.barriers.getById(input.barrierId);

    const hasPoint =
      input.lat != null &&
      input.lng != null &&
      Number.isFinite(input.lat) &&
      Number.isFinite(input.lng);

    if (hasPoint) {
      const inserted = await this.db.execute(sql`
        INSERT INTO voice_notes (
          barrier_id,
          user_id,
          transcription_text,
          raw_transcript,
          audio_storage_key,
          location
        ) VALUES (
          ${input.barrierId}::uuid,
          ${input.userId},
          ${transcriptionText},
          ${input.rawTranscript ?? null},
          ${input.audioStorageKey ?? null},
          ST_SetSRID(ST_MakePoint(${input.lng}, ${input.lat}), 4326)::geography
        )
        RETURNING
          id,
          barrier_id,
          user_id,
          transcription_text,
          raw_transcript,
          audio_storage_key,
          created_at
      `);
      return inserted.rows[0];
    }

    const [row] = await this.db
      .insert(voiceNotes)
      .values({
        barrierId: input.barrierId,
        userId: input.userId,
        transcriptionText,
        rawTranscript: input.rawTranscript ?? null,
        audioStorageKey: input.audioStorageKey ?? null,
      })
      .returning();

    return row;
  }

  listByBarrier(barrierId: string) {
    return this.db
      .select()
      .from(voiceNotes)
      .where(eq(voiceNotes.barrierId, barrierId));
  }
}
