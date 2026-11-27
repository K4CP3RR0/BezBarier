# BezBarier — handoff dla agentów / devów

## Stack

- `frontend/` — Next.js 16, React 19, Tailwind, pnpm
- `backend/` — NestJS 12 (ESM), pnpm
- DB — PostgreSQL + PostGIS na osobnym serwerze (`192.168.2.205`)
- Auth (plan) — Better Auth (tabele w schemacie DBML / Drizzle)
- ORM — Drizzle (`backend/src/database/schema*`, migracje w `backend/drizzle/`)

> Next.js 16: przed zmianami w `frontend/` przeczytaj lokalne guide’y w `frontend/node_modules/next/dist/docs/` oraz `frontend/AGENTS.md` (auto-generowane reguły Next).

## Domeny (prod)

| Warstwa | URL / dostęp |
| --- | --- |
| Frontend | https://bezbarier.kacpercichorski.tech |
| Backend | https://bezbarier-backend.kacpercichorski.tech |
| Baza | **NIE publiczna** — Twingate, TCP `192.168.2.205:5432` |

## Co już działa

- Backend → Postgres (`DATABASE_*`) + Drizzle + SSL self-signed
- Migracje: `backend/drizzle/` → `pnpm db:migrate` (Twingate ON; konto musi mieć `CREATE` na DB)
- Seed: `pnpm db:seed` → `roles`, `barrier_categories`, `barrier_statuses`
- Health: `GET /health/db`
- CORS: `CORS_ORIGINS` (domyślnie localhost:3000 + prod front)
- Better Auth: `/api/auth/*` (email/password; reset/verify = logi Nest bez SMTP)
- API: bariery, weryfikacje, uploady, voice notes, `GET/PUT` role użytkownika
- Front: landing, `/logowanie`, `/mapa` (Leaflet + lista), `/profil`, RequireAuth

## Kolejność setupu DB

1. Twingate ON + auth do `192.168.2.205`
2. Granty (admin DB): `GRANT CREATE ON DATABASE bezbarier TO bezbarier_app;`
3. `cd backend && pnpm db:migrate`
4. `pnpm db:seed`
5. `pnpm start` + front `pnpm dev`

## Czego NIE ma / słabe miejsca

- SMTP produkcyjny (maile auth tylko w logach)
- Pełne e2e w CI (jest live happy path za `E2E_LIVE=1`)
- Mapa kafelkowa jest; routing / nawigacja tras — później

## Schemat bazy

- DBML: https://dbdiagram.io/d/BazaBezBarier-6ae9d2cac7dad92865fff38d
- Kluczowe:
  - Better Auth: `user`, `session`, `account`, `verification`
  - Domena: `roles`, `user_roles`, `user_accessibility_profiles`, `barrier_categories`, `barrier_statuses`, `barriers`, `voice_notes`, `barrier_verifications`
- `barriers.location` / `voice_notes.location` = PostGIS `GEOGRAPHY(POINT,4326)`
- Anty-duplikat ~10 m przez `ST_DWithin`

## Env — lokalny backend (`backend/.env`)

Skopiuj z `backend/.env.example`. **Twingate musi być ON**, zanim odpalisz Nest.

```env
PORT=4000
DATABASE_HOST=192.168.2.205
DATABASE_PORT=5432
DATABASE_USER=bezbarier_app
DATABASE_PASSWORD=
DATABASE_NAME=bezbarier
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:4000
CORS_ORIGINS=http://localhost:3000,https://bezbarier.kacpercichorski.tech
STORAGE_DIR=./storage

```

Frontend (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Prod (`/opt/bezbarier` na serwerze)

- Compose **nie jest w git** — żyje tylko na serwerze
- Host `.env` używa m.in. `DB_USER` / `DB_PASSWORD` / `DB_NAME` (substytucja compose)
- Kontener backendu musi dostać `DATABASE_*` (nie wystarczy sam `DATABASE_URL` przy obecnym kodzie)
- Restart bez pusha: `cd /opt/bezbarier && docker compose up -d --force-recreate backend`
- Deploy CI: push/merge do `master` → GHCR → self-hosted pull (`.github/workflows/deploy.yml`)
- Lokalny serwis `db` w compose prod jest zbędny, jeśli używacie zewnętrznego `192.168.2.205`

## Git workflow

- **Agenci / AI:** nie tworzą commitów samodzielnie — tylko na wyraźną prośbę użytkownika. Nie zmieniają `user.name` / `user.email` i nie ustawiają siebie (ani Cursor/AI) jako autora ani committera.
- Branch protection / ruleset na `master`: reszta tylko przez PR
- Repository admin może bypass (bezpośredni push)
- Konwencja commitów (Conventional Commits, opis po angielsku, bez kropki na końcu):

```text
<type>(<scope>): <krótki opis po angielsku / bez kropki na końcu>
```

- **type:** `feat` | `fix` | `chore` | `ci` | `docs` | `refactor` | `test`
- **scope:** `backend` | `frontend` | `docker` | `db` … (opcjonalny, np. czyste `ci:`)

Przykłady:

```text
feat(backend): add PostgreSQL connection pool and db health check
fix(frontend): correct API base URL for production
chore(backend): update .env.example database variables
ci: retrigger deploy after compose fix
```
