/**
 * Live e2e against running Nest (Twingate + migrate + seed).
 *
 * Terminal 1: cd backend && pnpm start
 * Terminal 2: cd backend && $env:E2E_LIVE="1"; pnpm test:e2e
 */
import { describe, expect, it } from 'vitest';

const live = process.env.E2E_LIVE === '1';
const baseUrl = (process.env.E2E_BASE_URL ?? 'http://localhost:4000').replace(
  /\/$/,
  '',
);

function collectCookies(res: Response): string {
  const anyHeaders = res.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const list =
    typeof anyHeaders.getSetCookie === 'function'
      ? anyHeaders.getSetCookie()
      : [];
  if (list.length) {
    return list.map((c) => c.split(';')[0]).join('; ');
  }
  const single = res.headers.get('set-cookie');
  return single ? single.split(';')[0] : '';
}

(live ? describe : describe.skip)('happy path (live API)', () => {
  it('signup → create barrier → list nearby', async () => {
    const stamp = Date.now();
    const email = `e2e.${stamp}@example.com`;
    const password = 'TestPass123!';
    const lat = 52.2297;
    const lng = 21.0122;

    const signUp = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'E2E User',
        email,
        password,
      }),
    });
    expect(signUp.ok, await signUp.text()).toBe(true);
    let cookie = collectCookies(signUp);

    if (!cookie) {
      const signIn = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      expect(signIn.ok, await signIn.text()).toBe(true);
      cookie = collectCookies(signIn);
    }
    expect(cookie.length).toBeGreaterThan(0);

    const categories = await fetch(`${baseUrl}/meta/categories`);
    expect(categories.ok).toBe(true);
    const cats = (await categories.json()) as Array<{ code: string }>;
    expect(cats.length).toBeGreaterThan(0);
    const categoryCode = cats[0].code;

    const create = await fetch(`${baseUrl}/barriers`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie,
      },
      body: JSON.stringify({
        categoryCode,
        description: `E2E barrier ${stamp}`,
        lat,
        lng,
        source: 'MANUAL',
      }),
    });
    expect(create.ok, await create.text()).toBe(true);
    const created = (await create.json()) as { id: string };
    expect(created.id).toBeTruthy();

    const list = await fetch(
      `${baseUrl}/barriers?lat=${lat}&lng=${lng}&radiusMeters=2000`,
    );
    expect(list.ok).toBe(true);
    const rows = (await list.json()) as Array<{ id: string; description: string }>;
    expect(rows.some((r) => r.id === created.id)).toBe(true);
  }, 60_000);
});