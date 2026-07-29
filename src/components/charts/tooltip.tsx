'use client';

import {
  formatMetricValue,
  SEGMENT_COLORS,
  SEGMENT_LABELS,
  type SegmentKey,
} from '@/lib/metric-chart';
import { PROTOCOL_LABELS } from '@/lib/normalize';
import type { MetricKey } from '@/lib/types';

export const METRIC_TOOLTIP_WRAPPER_STYLE = {
  width: 'auto',
  maxWidth: 'none',
} as const;

type MetricSegmentTooltipProps = {
  metric: MetricKey;
  segmentKey: SegmentKey;
  value: number;
  color?: string;
  percentage?: number;
};

export function MetricSegmentTooltip({
  metric,
  segmentKey,
  value,
  color,
  percentage,
}: MetricSegmentTooltipProps) {
  const label =
    segmentKey === 'mpp'
      ? SEGMENT_LABELS.mpp
      : `${PROTOCOL_LABELS.x402} (${SEGMENT_LABELS[segmentKey]})`;
  const fill = color ?? SEGMENT_COLORS[segmentKey];

  return (
    <div className="w-max whitespace-nowrap rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <div className="flex flex-nowrap items-center gap-2">
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: fill }} />
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{formatMetricValue(metric, value)}</span>
        {percentage != null && (
          <span className="text-muted-foreground">({percentage.toFixed(1)}%)</span>
        )}
      </div>
    </div>
  );
}
