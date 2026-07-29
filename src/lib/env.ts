const ENV_KEYS = [
  'DATABASE_URL',
  'CRON_SECRET',
  'X402_PRIVATE_KEY',
  'DISCORD_WEBHOOK_URL',
] as const;

type EnvKey = (typeof ENV_KEYS)[number];

const ENV_HELP: Record<EnvKey, string> = {
  DATABASE_URL: 'Postgres connection string (use 127.0.0.1 on macOS)',
  CRON_SECRET: 'Secret for /api/cron/sync-stats (pnpm sync sends Bearer token)',
  X402_PRIVATE_KEY: 'EVM private key for SIWx + Base USDC x402 payments',
  DISCORD_WEBHOOK_URL: 'Discord webhook URL for app notifications',
};

function readEnv(key: EnvKey): string {
  return process.env[key]?.trim() ?? '';
}

function validateEnv(): Record<EnvKey, string> {
  const missing = ENV_KEYS.filter((key) => !readEnv(key));

  if (missing.length === 0) {
    return {
      DATABASE_URL: readEnv('DATABASE_URL'),
      CRON_SECRET: readEnv('CRON_SECRET'),
      X402_PRIVATE_KEY: readEnv('X402_PRIVATE_KEY'),
      DISCORD_WEBHOOK_URL: readEnv('DISCORD_WEBHOOK_URL'),
    };
  }

  const lines = missing.map((key) => `  ${key} — ${ENV_HELP[key]}`);
  throw new Error(
    `Missing required environment variables:\n${lines.join('\n')}\nCopy .env.example to .env.local and fill in all values.`,
  );
}

export const env =
  process.env.SKIP_ENV_VALIDATION === '1'
    ? {
        DATABASE_URL: readEnv('DATABASE_URL'),
        CRON_SECRET: readEnv('CRON_SECRET'),
        X402_PRIVATE_KEY: readEnv('X402_PRIVATE_KEY'),
        DISCORD_WEBHOOK_URL: readEnv('DISCORD_WEBHOOK_URL'),
      }
    : validateEnv();
