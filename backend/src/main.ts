import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000',
  'https://bezbarier.kacpercichorski.tech',
];

function resolveCorsOrigins(): string[] {
  const fromEnv = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_CORS_ORIGINS;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: resolveCorsOrigins(),
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();