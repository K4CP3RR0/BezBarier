import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../database/schema.js';

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

const trustedOrigins = (
  process.env.CORS_ORIGINS ??
  'http://localhost:3000,https://bezbarier.kacpercichorski.tech'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

/** MVP: bez SMTP — linki lecą do logów Nest. Potem podmienisz na Resend/Mailgun. */
function logAuthEmail(kind: string, to: string, url: string) {
  console.log(`[auth-email:${kind}] to=${to} url=${url}`);
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:4000',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      logAuthEmail('reset-password', user.email, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      logAuthEmail('verify-email', user.email, url);
    },
  },
});

export type Auth = typeof auth;