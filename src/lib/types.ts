export type Timeframe = 1 | 7 | 30;

export type ProtocolKey = 'x402' | 'mpp';

export type ChainKey = 'base' | 'solana';

export type MetricKey = 'transactions' | 'volume' | 'buyers' | 'sellers';

export type ProtocolStats = {
  protocol: ProtocolKey;
  chain?: ChainKey;
  timeframe: Timeframe;
  transactions: number;
  volume: number;
  buyers: number;
  sellers: number;
};

export type SnapshotSet = {
  fetchedAt: Date;
  stats: ProtocolStats[];
};
