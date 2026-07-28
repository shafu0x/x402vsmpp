import { formatCount, formatVolume } from '@/lib/format';
import { CHAIN_COLORS, CHAIN_LABELS, PROTOCOL_COLORS, PROTOCOL_LABELS } from '@/lib/normalize';
import type { ChainKey, MetricKey, ProtocolStats } from '@/lib/types';

export type ChartType = 'bar' | 'pie';

export type SegmentKey = ChainKey | 'mpp';

export type MetricChartProps = {
  metric: MetricKey;
  x402Base: ProtocolStats | null;
  x402Solana: ProtocolStats | null;
  mpp: ProtocolStats | null;
};

export type MetricSegments = {
  metric: MetricKey;
  base: number;
  solana: number;
  mpp: number;
  x402: number;
  total: number;
};

type SegmentDatum = {
  key: SegmentKey;
  value: number;
  fill: string;
  label: string;
};

type ProtocolHeaderItem = {
  key: 'x402' | 'mpp';
  value: number;
  color: string;
  label: string;
};

export const METRIC_LABELS: Record<MetricKey, string> = {
  transactions: 'Transactions',
  volume: 'Volume',
  buyers: 'Buyers',
  sellers: 'Sellers',
};

export const SEGMENT_LABELS: Record<SegmentKey, string> = {
  base: CHAIN_LABELS.base,
  solana: CHAIN_LABELS.solana,
  mpp: PROTOCOL_LABELS.mpp,
};

export const SEGMENT_COLORS: Record<SegmentKey, string> = {
  base: CHAIN_COLORS.base,
  solana: CHAIN_COLORS.solana,
  mpp: PROTOCOL_COLORS.mpp,
};

export function formatMetricValue(metric: MetricKey, value: number) {
  return metric === 'volume' ? formatVolume(value) : formatCount(value);
}

function getMetricValue(stat: ProtocolStats | null, metric: MetricKey) {
  if (!stat) return 0;
  return stat[metric];
}

export function getMetricSegments({
  metric,
  x402Base,
  x402Solana,
  mpp,
}: MetricChartProps): MetricSegments {
  const base = getMetricValue(x402Base, metric);
  const solana = getMetricValue(x402Solana, metric);
  const mppValue = getMetricValue(mpp, metric);
  const x402 = base + solana;

  return {
    metric,
    base,
    solana,
    mpp: mppValue,
    x402,
    total: x402 + mppValue,
  };
}

export function toSegmentData(segments: MetricSegments): SegmentDatum[] {
  return (['base', 'solana', 'mpp'] as const).map((key) => ({
    key,
    value: segments[key],
    fill: SEGMENT_COLORS[key],
    label: SEGMENT_LABELS[key],
  }));
}

export function getProtocolHeaderItems(segments: MetricSegments): ProtocolHeaderItem[] {
  return [
    {
      key: 'x402',
      value: segments.x402,
      color: PROTOCOL_COLORS.x402,
      label: PROTOCOL_LABELS.x402,
    },
    {
      key: 'mpp',
      value: segments.mpp,
      color: PROTOCOL_COLORS.mpp,
      label: PROTOCOL_LABELS.mpp,
    },
  ];
}

export const CHART_CONFIG = {
  base: { label: CHAIN_LABELS.base, color: CHAIN_COLORS.base },
  solana: { label: CHAIN_LABELS.solana, color: CHAIN_COLORS.solana },
  mpp: { label: PROTOCOL_LABELS.mpp, color: PROTOCOL_COLORS.mpp },
};
