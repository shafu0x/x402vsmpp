import type { Prisma } from '@/generated/prisma/client';

import { prisma } from '@/lib/db';
import type {
  ProtocolKey,
  ProtocolStats,
  SnapshotSet,
  Timeframe,
  TopVolumeEntry,
} from '@/lib/types';

const snapshotSelect = {
  protocol: true,
  chain: true,
  timeframe: true,
  transactions: true,
  volume: true,
  buyers: true,
  sellers: true,
} as const;

const leaderboardSelect = {
  protocol: true,
  timeframe: true,
  rank: true,
  name: true,
  href: true,
  logoUrl: true,
  chains: true,
  facilitators: true,
  transactions: true,
  volume: true,
  buyers: true,
} as const;

type SnapshotRow = Prisma.ProtocolSnapshotGetPayload<{ select: typeof snapshotSelect }>;
type LeaderboardRow = Prisma.ServiceLeaderboardEntryGetPayload<{
  select: typeof leaderboardSelect;
}>;

function toProtocolStats(row: SnapshotRow): ProtocolStats {
  return {
    protocol: row.protocol as ProtocolKey,
    chain: row.chain ?? undefined,
    timeframe: row.timeframe as Timeframe,
    transactions: Number(row.transactions),
    volume: row.volume.toNumber(),
    buyers: row.buyers,
    sellers: row.sellers,
  };
}

function toTopVolumeEntry(row: LeaderboardRow): TopVolumeEntry {
  return {
    protocol: row.protocol as ProtocolKey,
    timeframe: row.timeframe as Timeframe,
    rank: row.rank,
    name: row.name,
    href: row.href,
    logoUrl: row.logoUrl,
    chains: row.chains,
    facilitators: row.facilitators,
    transactions: Number(row.transactions),
    volume: row.volume.toNumber(),
    buyers: row.buyers,
  };
}

export async function getLatestSnapshotSet(): Promise<SnapshotSet> {
  const latest = await prisma.protocolSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  if (!latest) {
    throw new Error('No snapshot data yet. Run pnpm sync.');
  }

  const [rows, leaderboardRows] = await Promise.all([
    prisma.protocolSnapshot.findMany({
      where: { fetchedAt: latest.fetchedAt },
      orderBy: [{ timeframe: 'asc' }, { protocol: 'asc' }, { chain: 'asc' }],
      select: snapshotSelect,
    }),
    prisma.serviceLeaderboardEntry.findMany({
      where: { fetchedAt: latest.fetchedAt },
      orderBy: [{ timeframe: 'asc' }, { rank: 'asc' }],
      select: leaderboardSelect,
    }),
  ]);

  return {
    fetchedAt: latest.fetchedAt,
    stats: rows.map(toProtocolStats),
    topVolume: leaderboardRows.map(toTopVolumeEntry),
  };
}

export async function saveProtocolStats(stats: ProtocolStats[], fetchedAt = new Date()) {
  await prisma.protocolSnapshot.createMany({
    data: stats.map((stat) => ({
      fetchedAt,
      timeframe: stat.timeframe,
      protocol: stat.protocol,
      chain: stat.chain ?? null,
      transactions: BigInt(stat.transactions),
      volume: stat.volume,
      buyers: stat.buyers,
      sellers: stat.sellers,
    })),
  });

  return fetchedAt;
}

export async function saveLeaderboardEntries(entries: TopVolumeEntry[], fetchedAt = new Date()) {
  await prisma.serviceLeaderboardEntry.createMany({
    data: entries.map((entry) => ({
      fetchedAt,
      timeframe: entry.timeframe,
      protocol: entry.protocol,
      rank: entry.rank,
      name: entry.name,
      href: entry.href,
      logoUrl: entry.logoUrl,
      chains: entry.chains,
      facilitators: entry.facilitators,
      transactions: BigInt(entry.transactions),
      volume: entry.volume,
      buyers: entry.buyers,
    })),
  });

  return fetchedAt;
}
