import type { Prisma } from '@/generated/prisma/client';

import { prisma } from '@/lib/db';
import type { ProtocolKey, ProtocolStats, SnapshotSet, Timeframe } from '@/lib/types';

const snapshotSelect = {
  protocol: true,
  chain: true,
  timeframe: true,
  transactions: true,
  volume: true,
  buyers: true,
  sellers: true,
} as const;

type SnapshotRow = Prisma.ProtocolSnapshotGetPayload<{ select: typeof snapshotSelect }>;

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

export async function getLatestSnapshotSet(): Promise<SnapshotSet | null> {
  const latest = await prisma.protocolSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  if (!latest) return null;

  const rows = await prisma.protocolSnapshot.findMany({
    where: { fetchedAt: latest.fetchedAt },
    orderBy: [{ timeframe: 'asc' }, { protocol: 'asc' }, { chain: 'asc' }],
    select: snapshotSelect,
  });

  return {
    fetchedAt: latest.fetchedAt,
    stats: rows.map(toProtocolStats),
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
