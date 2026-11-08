# BezBarier

Aplikacja do zgłaszania i weryfikacji barier dostępności (mapa, lokalizacja PostGIS, auth).

| | |
| --- | --- |
| Frontend (prod) | https://bezbarier.kacpercichorski.tech |
| Backend (prod) | https://bezbarier-backend.kacpercichorski.tech |
| Schemat DB | [DBML / dbdiagram](https://dbdiagram.io/d/BazaBezBarier-6ae9d2cac7dad92865fff38d) |

## Stack

| Część | Tech |
| --- | --- |
| `frontend/` | Next.js 16, React 19, Tailwind, pnpm |
| `backend/` | NestJS 12 (ESM), `pg` Pool, pnpm |
| Baza | PostgreSQL + PostGIS (`192.168.2.205`, dostęp przez Twingate) |
| Auth (plan) | Better Auth |
| ORM | jeszcze brak — Docelowo Drizzle |

## Struktura repo

```text
BezBarier/
├── frontend/          # Next.js
├── backend/           # NestJS
├── .github/workflows/ # build + deploy (GHCR → self-hosted)
├── docker-compose.dev.yml
├── AGENTS.md          # handoff dla agentów / szczegółowy kontekst
└── README.md
```

## Wymagania

- Node.js + **pnpm**
- Dostęp do bazy przez **Twingate** (resource TCP `192.168.2.205:5432`)
- Lokalnego PostGIS w Dockerze **nie wymagamy** na co dzień (problemy WSL); opcjonalnie jest `docker-compose.dev.yml`

## Setup — backend

```bash
cd backend
cp .env.example .env   # uzupełnij DATABASE_PASSWORD
pnpm install
pnpm run start:dev
```

`backend/.env`:

```env
PORT=4000
DATABASE_HOST=192.168.2.205
DATABASE_PORT=5432
DATABASE_USER=bezbarier_app
DATABASE_PASSWORD=
DATABASE_NAME=bezbarier
```

**Twingate musi być włączony** przed startem Nesta.

Health check: `GET http://localhost:4000/health/db` → `{ ok, postgis }`

## Setup — frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Opcjonalnie `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> Front i backend **nie są jeszcze spięte** w kodzie — zmienna jest przygotowana pod kolejne prace. Na produkcji trzeba ustawić URL API oraz CORS w Nest pod domenę frontu.

## Stan projektu

**Działa**

- Połączenie Nest → Postgres (`DATABASE_*`)
- Moduł `backend/src/database/`
- `GET /health/db` + PostGIS na koncie `bezbarier_app` / baza `bezbarier`

**Do zrobienia**

- Integracja Next ↔ Nest (CORS, `NEXT_PUBLIC_API_URL` na prod)
- ORM + migracje ze schematu DBML
- Tabele Better Auth + domena w DB z migracji w repo
- Endpointy API (bariery, auth, …)

## Schemat bazy (skrót)

- Better Auth: `user`, `session`, `account`, `verification`
- Domena: `roles`, `user_roles`, `user_accessibility_profiles`, `barrier_categories`, `barrier_statuses`, `barriers`, `voice_notes`, `barrier_verifications`
- `barriers.location` / `voice_notes.location` = `GEOGRAPHY(POINT,4326)`
- Anty-duplikat ~10 m: `ST_DWithin`

## Deploy

- CI: merge/push do `master` → build obrazów GHCR → self-hosted pull (`.github/workflows/deploy.yml`)
- Na serwerze: `/opt/bezbarier` (compose **nie jest w git**)
- Kontener backendu musi dostać zmienne `DATABASE_*` (sam `DATABASE_URL` nie wystarczy przy obecnym kodzie)
- Restart bez pusha: `cd /opt/bezbarier && docker compose up -d --force-recreate backend`

Baza produkcyjna nie jest publiczna — tylko przez Twingate.

## Git

- Zmiany na `master` przez PR (admin może bypass)
- Commity (Conventional Commits, opis po angielsku, bez kropki):

```text
<type>(<scope>): <short description>
```

`type`: `feat` | `fix` | `chore` | `ci` | `docs` | `refactor` | `test`  
`scope` (opcjonalnie): `backend` | `frontend` | `docker` | `db` …

```text
feat(backend): add PostgreSQL connection pool and db health check
fix(frontend): correct API base URL for production
chore(backend): update .env.example database variables
ci: retrigger deploy after compose fix
```

Więcej kontekstu operacyjnego: [`AGENTS.md`](./AGENTS.md).
