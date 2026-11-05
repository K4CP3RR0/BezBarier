import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import type { Pool, QueryResultRow } from 'pg';
import { PG_POOL } from './database.constants.js';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onModuleInit(): Promise<void> {
    const result = await this.ping();
    this.logger.log(`PostgreSQL OK (PostGIS: ${result.postgis ?? 'brak'})`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ) {
    return this.pool.query<T>(text, params);
  }

  async ping(): Promise<{ ok: true; postgis: string | null }> {
    const { rows } = await this.pool.query<{
      ok: number;
      postgis: string | null;
    }>(`
      SELECT
        1 AS ok,
        (SELECT extversion FROM pg_extension WHERE extname = 'postgis') AS postgis
    `);
    return { ok: true, postgis: rows[0]?.postgis ?? null };
  }
}
