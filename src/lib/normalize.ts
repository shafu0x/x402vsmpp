import type { ChainKey, ProtocolKey, ProtocolStats, Timeframe } from '@/lib/types';

type MppStatsResponse = {
  totalTransactions: number;
  totalVolume: number;
  uniqueSenders: number;
  uniqueRecipients: number;
};

type X402StatsResponse = {
  data: {
    total_transactions: number;
    total_amount: number;
    unique_buyers: number;
    unique_sellers: number;
  };
};

export function normalizeMppStats(timeframe: Timeframe, data: MppStatsResponse): ProtocolStats {
  return {
    protocol: 'mpp',
    timeframe,
    transactions: data.totalTransactions,
    volume: data.totalVolume,
    buyers: data.uniqueSenders,
    sellers: data.uniqueRecipients,
  };
}

export function normalizeX402Stats(
  timeframe: Timeframe,
  chain: ChainKey,
  raw: X402StatsResponse,
): ProtocolStats {
  const data = raw.data;
  return {
    protocol: 'x402',
    chain,
    timeframe,
    transactions: data.total_transactions,
    volume: data.total_amount / 1_000_000,
    buyers: data.unique_buyers,
    sellers: data.unique_sellers,
  };
}

export const PROTOCOL_LABELS: Record<ProtocolKey, string> = {
  x402: 'x402',
  mpp: 'MPP',
};

export const PROTOCOL_COLORS: Record<ProtocolKey, string> = {
  x402: '#00ADB5',
  mpp: '#393E46',
};

export const CHAIN_LABELS: Record<ChainKey, string> = {
  base: 'Base',
  solana: 'Solana',
};

export const CHAIN_COLORS: Record<ChainKey, string> = {
  base: '#00ADB5',
  solana: '#33C4CA',
};
