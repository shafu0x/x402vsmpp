import { TOP_VOLUME_LIMIT } from '@/lib/fetch-leaderboard';
import { getStatsForTimeframe, TIMEFRAME_OPTIONS } from '@/lib/snapshot-helpers';
import type { ProtocolStats, SnapshotSet, Timeframe, TopVolumeEntry } from '@/lib/types';

export type TimeframePanelData = {
  x402Base: ProtocolStats | null;
  x402Solana: ProtocolStats | null;
  mpp: ProtocolStats | null;
  topVolume: TopVolumeEntry[];
};

export type DashboardData = Record<Timeframe, TimeframePanelData>;

export function buildDashboardData(snapshot: SnapshotSet): DashboardData {
  return Object.fromEntries(
    TIMEFRAME_OPTIONS.map(({ value }) => {
      const stats = getStatsForTimeframe(snapshot, value);
      return [
        value,
        {
          ...stats,
          topVolume: snapshot.topVolume
            .filter((entry) => entry.timeframe === value)
            .toSorted((a, b) => a.rank - b.rank)
            .slice(0, TOP_VOLUME_LIMIT),
        },
      ];
    }),
  ) as DashboardData;
}
