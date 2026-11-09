import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { sql } from 'drizzle-orm';
import type { Pool, QueryResultRow } from 'pg';
import { DRIZZLE, PG_POOL } from './database.constants.js';
import type { DrizzleDb } from './database.types.js';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.db.execute(sql`SELECT 1`);
    this.logger.log('Drizzle OK (SELECT 1)');

    const result = await this.ping();
    this.logger.log(`PostgreSQL OK (PostGIS: ${result.postgis ?? 'brak'})`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  get drizzle(): DrizzleDb {
    return this.db;
  }

  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ) {
    return this.pool.query<T>(text, params);
  }

  async ping(): Promise<{ ok: true; postgis: string | null }> {
    const result = await this.db.execute<{
      ok: number;
      postgis: string | null;
    }>(sql`
      SELECT
        1 AS ok,
        (SELECT extversion FROM pg_extension WHERE extname = 'postgis') AS postgis
    `);
    const row = result.rows[0];
    return { ok: true, postgis: row?.postgis ?? null };
  }
}
