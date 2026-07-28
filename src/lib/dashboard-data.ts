import { getStatsForTimeframe, TIMEFRAME_OPTIONS } from '@/lib/snapshot-helpers';
import type { ProtocolStats, SnapshotSet, Timeframe } from '@/lib/types';

export type TimeframePanelData = {
  x402Base: ProtocolStats | null;
  x402Solana: ProtocolStats | null;
  mpp: ProtocolStats | null;
};

export type DashboardData = Record<Timeframe, TimeframePanelData>;

export function buildDashboardData(snapshot: SnapshotSet): DashboardData {
  return Object.fromEntries(
    TIMEFRAME_OPTIONS.map(({ value }) => [value, getStatsForTimeframe(snapshot, value)]),
  ) as DashboardData;
}
