import { formatAddress } from '@/lib/format';
import type { ChainKey, ProtocolKey, ProtocolStats, Timeframe, TopVolumeEntry } from '@/lib/types';

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

export type MppServiceResponse = {
  name: string;
  url: string;
  logoUrl: string | null;
  stats: {
    transactions: number;
    volume: number;
    buyers: number;
  };
};

export type X402MerchantResponse = {
  recipient: string;
  facilitator_ids: string[];
  tx_count: number;
  total_amount: number;
  unique_buyers: number;
  chains: string[];
};

type TopVolumeCandidate = Omit<TopVolumeEntry, 'rank'>;

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

export function normalizeMppService(
  timeframe: Timeframe,
  service: MppServiceResponse,
): TopVolumeCandidate {
  return {
    protocol: 'mpp',
    timeframe,
    name: service.name,
    href: service.url,
    logoUrl: service.logoUrl,
    chains: 'tempo',
    facilitators: null,
    transactions: service.stats.transactions,
    volume: service.stats.volume,
    buyers: service.stats.buyers,
  };
}

export function normalizeX402Merchant(
  timeframe: Timeframe,
  merchant: X402MerchantResponse,
): TopVolumeCandidate {
  return {
    protocol: 'x402',
    timeframe,
    name: formatAddress(merchant.recipient),
    href: `https://x402scan.com/recipient/${merchant.recipient}`,
    logoUrl: null,
    chains: merchant.chains.map((chain) => chain.toLowerCase()).join(','),
    facilitators: merchant.facilitator_ids.join(', ') || null,
    transactions: merchant.tx_count,
    volume: merchant.total_amount / 1_000_000,
    buyers: merchant.unique_buyers,
  };
}

export const PROTOCOL_LABELS: Record<ProtocolKey, string> = {
  x402: 'x402',
  mpp: 'MPP',
};

export const PROTOCOL_COLORS: Record<ProtocolKey, string> = {
  x402: '#0000ff',
  mpp: '#32353d',
};

export const CHAIN_LABELS: Record<ChainKey, string> = {
  base: 'Base',
  solana: 'Solana',
};

export const CHAIN_COLORS: Record<ChainKey, string> = {
  base: '#0000ff',
  solana: '#3c8aff',
};
