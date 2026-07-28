import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

import { normalizeMppStats, normalizeX402Stats } from '@/lib/normalize';
import type { ChainKey, ProtocolStats, Timeframe } from '@/lib/types';

const execFileAsync = promisify(execFile);

const TIMEFRAMES: Timeframe[] = [1, 7, 30];
const X402_CHAINS: ChainKey[] = ['base', 'solana'];

type AgentcashResponse<T> = {
  success: boolean;
  data: T;
};

async function agentcashFetch<T>(url: string): Promise<T> {
  const agentcashBin = path.join(process.cwd(), 'node_modules', '.bin', 'agentcash');

  const { stdout } = await execFileAsync(agentcashBin, ['fetch', url, '--format', 'json'], {
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  });

  const trimmed = stdout.trim();
  if (!trimmed) {
    throw new Error(`AgentCash returned empty output for ${url}`);
  }

  const result = JSON.parse(trimmed) as AgentcashResponse<T>;
  if (!result.success) {
    throw new Error(`AgentCash fetch failed for ${url}`);
  }

  return result.data;
}

export async function fetchAllProtocolStats(): Promise<ProtocolStats[]> {
  const requests = TIMEFRAMES.flatMap((timeframe) => [
    agentcashFetch(`https://mppscan.com/api/mpp/stats?timeframe=${timeframe}`).then((data) =>
      normalizeMppStats(timeframe, data as Parameters<typeof normalizeMppStats>[1]),
    ),
    ...X402_CHAINS.map((chain) =>
      agentcashFetch(
        `https://x402scan.com/api/x402/facilitators/stats?timeframe=${timeframe}&chain=${chain}`,
      ).then((data) =>
        normalizeX402Stats(timeframe, chain, data as Parameters<typeof normalizeX402Stats>[2]),
      ),
    ),
  ]);

  return Promise.all(requests);
}
