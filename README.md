# x402 vs MPP

Compare x402 and MPP protocol stats with grouped bar charts.

## Setup

```bash
brew services start postgresql@16
createdb x402vsmpp
cp .env.example .env.local
# set X402_PRIVATE_KEY in .env.local (from ~/.agentcash/wallet.json or a dedicated key)
# use 127.0.0.1 instead of localhost if Prisma reports access denied on macOS
pnpm install
pnpm db:push
```

## Local dev

```bash
pnpm dev
pnpm sync
pnpm check
```

## Environment

- `DATABASE_URL` — Postgres connection string
- `CRON_SECRET` — protects `/api/cron/sync-stats`
- `X402_PRIVATE_KEY` — AgentCash wallet for SIWX + x402 payments
