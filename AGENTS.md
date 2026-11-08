# BezBarier — handoff dla agentów / devów

## Stack

- `frontend/` — Next.js 16, React 19, Tailwind, pnpm
- `backend/` — NestJS 12 (ESM), pnpm
- DB — PostgreSQL + PostGIS na osobnym serwerze (`192.168.2.205`)
- Auth (plan) — Better Auth (tabele w schemacie DBML)
- ORM — jeszcze nie ma; jest tylko `pg` Pool. Drizzle/Prisma = do zrobienia

> Next.js 16: przed zmianami w `frontend/` przeczytaj lokalne guide’y w `frontend/node_modules/next/dist/docs/` oraz `frontend/AGENTS.md` (auto-generowane reguły Next).

## Domeny (prod)

| Warstwa | URL / dostęp |
| --- | --- |
| Frontend | https://bezbarier.kacpercichorski.tech |
| Backend | https://bezbarier-backend.kacpercichorski.tech |
| Baza | **NIE publiczna** — Twingate, TCP `192.168.2.205:5432` |

## Co już działa

- Backend łączy się z Postgresem przez env: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- Moduł: `backend/src/database/` (`DatabaseModule`, `DatabaseService`, pool)
- Health: `GET /health/db` → `{ ok, postgis }`
- Konto DB: `bezbarier_app` (nie superuser), baza `bezbarier`, extension PostGIS wgrany
- Lokalnego Dockera z PostGIS **nie wymagamy** (problemy WSL) — dev łączy się do tej samej bazy przez Twingate

## Czego NIE ma (kolejna robota)

1. **Next ↔ Nest** — NIE spięte. Jest tylko `frontend/.env.local` z `NEXT_PUBLIC_API_URL=http://localhost:4000`; kod tego nie używa. Na prodzie: URL backendu + CORS w Nest pod domenę frontu.
2. **Drizzle (lub inny ORM) + migracje** ze schematu
3. **Schemat domenowy / Better Auth w DB** — tabele jeszcze nie z migracji w repo
4. **Realne endpointy API** (bariery, auth, itd.)

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
```

Frontend (lokalnie, jeszcze nieużywane w kodzie):

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
