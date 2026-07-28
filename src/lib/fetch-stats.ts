import { jsonFetch } from '@/lib/paid-fetch';
import { normalizeMppStats, normalizeX402Stats } from '@/lib/normalize';
import type { ChainKey, ProtocolStats, Timeframe } from '@/lib/types';

const TIMEFRAMES: Timeframe[] = [1, 7, 30];
const X402_CHAINS: ChainKey[] = ['base', 'solana'];

export async function fetchAllProtocolStats(): Promise<ProtocolStats[]> {
  const requests = TIMEFRAMES.flatMap((timeframe) => [
    jsonFetch(`https://mppscan.com/api/mpp/stats?timeframe=${timeframe}`).then((data) =>
      normalizeMppStats(timeframe, data as Parameters<typeof normalizeMppStats>[1]),
    ),
    ...X402_CHAINS.map((chain) =>
      jsonFetch(
        `https://x402scan.com/api/x402/facilitators/stats?timeframe=${timeframe}&chain=${chain}`,
      ).then((data) =>
        normalizeX402Stats(timeframe, chain, data as Parameters<typeof normalizeX402Stats>[2]),
      ),
    ),
  ]);

  return Promise.all(requests);
}
