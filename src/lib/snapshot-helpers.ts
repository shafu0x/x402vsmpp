import type { MetricKey, ProtocolStats, SnapshotSet, Timeframe } from '@/lib/types';

export function getStatsForTimeframe(
  snapshot: SnapshotSet,
  timeframe: Timeframe,
): { x402Base: ProtocolStats | null; x402Solana: ProtocolStats | null; mpp: ProtocolStats | null } {
  const forTimeframe = snapshot.stats.filter((stat) => stat.timeframe === timeframe);
  return {
    x402Base:
      forTimeframe.find((stat) => stat.protocol === 'x402' && stat.chain === 'base') ?? null,
    x402Solana:
      forTimeframe.find((stat) => stat.protocol === 'x402' && stat.chain === 'solana') ?? null,
    mpp: forTimeframe.find((stat) => stat.protocol === 'mpp') ?? null,
  };
}

export const METRICS: MetricKey[] = ['transactions', 'volume', 'buyers', 'sellers'];

export const TIMEFRAME_OPTIONS: { value: Timeframe; label: string }[] = [
  { value: 1, label: '24 Hours' },
  { value: 7, label: '7 Days' },
  { value: 30, label: '30 Days' },
];
