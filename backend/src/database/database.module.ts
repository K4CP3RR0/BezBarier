import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DRIZZLE, PG_POOL } from './database.constants.js';
import { DatabaseService } from './database.service.js';
import type { DrizzleDb } from './database.types.js';
import * as schema from './schema.js';

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Pool({
          host: config.getOrThrow<string>('DATABASE_HOST'),
          port: Number(config.get('DATABASE_PORT') ?? 5432),
          user: config.getOrThrow<string>('DATABASE_USER'),
          password: config.getOrThrow<string>('DATABASE_PASSWORD'),
          database: config.getOrThrow<string>('DATABASE_NAME'),
          max: 10,
        });
      },
    },
    {
      provide: DRIZZLE,
      inject: [PG_POOL],
      useFactory: (pool: Pool): DrizzleDb => {
        return drizzle(pool, { schema });
      },
    },
    DatabaseService,
  ],
  exports: [PG_POOL, DRIZZLE, DatabaseService],
})
export class DatabaseModule {}
