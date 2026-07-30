export type Timeframe = 1 | 7 | 30;

export type ProtocolKey = 'x402' | 'mpp';

export type ChainKey = 'base' | 'solana';

export type MetricKey = 'transactions' | 'volume' | 'buyers' | 'sellers' | 'avgTicket';

export type ProtocolStats = {
  protocol: ProtocolKey;
  chain?: ChainKey;
  timeframe: Timeframe;
  transactions: number;
  volume: number;
  buyers: number;
  sellers: number;
};

export type TopVolumeEntry = {
  protocol: ProtocolKey;
  timeframe: Timeframe;
  rank: number;
  name: string;
  href: string | null;
  logoUrl: string | null;
  chains: string | null;
  facilitators: string | null;
  transactions: number;
  volume: number;
  buyers: number;
};

export type SnapshotSet = {
  fetchedAt: Date;
  stats: ProtocolStats[];
  topVolume: TopVolumeEntry[];
};
