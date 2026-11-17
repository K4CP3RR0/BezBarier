import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  barrierCategories,
  barrierStatuses,
  roles,
} from './schema.js';

const rolesSeed = [
  {
    code: 'BLIND',
    name: 'Niewidomy / słabowidzący',
    description: 'Sterowanie głosem, TTS, audiodeskrypcja trasy',
  },
  {
    code: 'WHEELCHAIR',
    name: 'Wózek / ograniczona mobilność',
    description: 'Trasy bez schodów, kontrola nachyleń i szerokości',
  },
  {
    code: 'VOLUNTEER',
    name: 'Wolontariusz / audytor',
    description: 'Weryfikacja zgłoszeń i potwierdzanie barier',
  },
] as const;

const categoriesSeed = [
  {
    code: 'STAIRS',
    name: 'Schody',
    description: 'Schody bez podjazdu / windy',
  },
  {
    code: 'CURB',
    name: 'Krawężnik',
    description: 'Wysoki krawężnik bez obniżenia',
  },
  {
    code: 'SURFACE',
    name: 'Nawierzchnia',
    description: 'Dziury, luźna kostka, błoto',
  },
  {
    code: 'CROSSING',
    name: 'Przejście',
    description: 'Brak sygnalizacji / słabe oznakowanie',
  },
  {
    code: 'OBSTACLE',
    name: 'Przeszkoda',
    description: 'Zaparkowany pojazd, słupek, plac budowy',
  },
] as const;

const statusesSeed = [
  {
    code: 'REPORTED',
    name: 'Zgłoszona',
    description: 'Nowe zgłoszenie, bez weryfikacji',
  },
  {
    code: 'CONFIRMED',
    name: 'Potwierdzona',
    description: 'Potwierdzona przez społeczność / audytora',
  },
  {
    code: 'RESOLVED',
    name: 'Usunięta',
    description: 'Bariera usunięta lub nieaktualna',
  },
  {
    code: 'DISPUTED',
    name: 'Sporna',
    description: 'Sprzeczne weryfikacje',
  },
] as const;

async function seed() {
  const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT ?? 5432),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: { rejectUnauthorized: false },
  });

  const db = drizzle(pool);

  try {
    for (const row of rolesSeed) {
      await db
        .insert(roles)
        .values(row)
        .onConflictDoUpdate({
          target: roles.code,
          set: { name: row.name, description: row.description },
        });
    }

    for (const row of categoriesSeed) {
      await db
        .insert(barrierCategories)
        .values(row)
        .onConflictDoUpdate({
          target: barrierCategories.code,
          set: { name: row.name, description: row.description },
        });
    }

    for (const row of statusesSeed) {
      await db
        .insert(barrierStatuses)
        .values(row)
        .onConflictDoUpdate({
          target: barrierStatuses.code,
          set: { name: row.name, description: row.description },
        });
    }

    console.log('Seed OK: roles, barrier_categories, barrier_statuses');
  } finally {
    await pool.end();
  }
}

await seed();