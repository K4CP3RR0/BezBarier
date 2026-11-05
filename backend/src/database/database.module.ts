import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PG_POOL } from './database.constants.js';
import { DatabaseService } from './database.service.js';

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
    DatabaseService,
  ],
  exports: [PG_POOL, DatabaseService],
})
export class DatabaseModule {}
