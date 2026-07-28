# Agent instructions

## Git

**Never push to the remote unless the user explicitly asks you to.**

**Always run `pnpm check` before opening a PR.** Fix any failures first — do not open or update a pull request until it passes locally.

## Planning

When creating a plan, always review **Vercel best practices** first and align the plan with them. Read the relevant skills before drafting:

- `vercel-react-best-practices` — React/Next.js performance patterns
- `nextjs` / `next-best-practices` — App Router, RSC, caching, data fetching
- Other Vercel skills as needed (e.g. `vercel-functions`, `cdn-caching`, `env-vars`)

Call out in the plan where recommendations follow or diverge from those guides.

## Project

Next.js 16 dashboard comparing x402 vs MPP protocol stats. Postgres via Prisma 7, daily sync via AgentCash CLI, charts with Recharts.

## Commands

```bash
pnpm dev          # local server
pnpm sync         # fetch stats (dev server must be running)
pnpm check        # types + lint + format + knip
pnpm db:push      # apply schema to Postgres
```

Node **20.20.0** (`.nvmrc`), pnpm **9.15.0** (`packageManager` in `package.json`).

## Environment

All three are required at app startup. Copy `.env.example` to `.env.local`.

| Variable           | Purpose                                |
| ------------------ | -------------------------------------- |
| `DATABASE_URL`     | Postgres connection string             |
| `CRON_SECRET`      | Protects `/api/cron/sync-stats`        |
| `X402_PRIVATE_KEY` | AgentCash wallet for paid stat fetches |
