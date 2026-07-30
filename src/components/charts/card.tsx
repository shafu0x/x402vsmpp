'use client';

import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatMetricValue, getProtocolHeaderItems, type MetricSegments } from '@/lib/metric-chart';

type MetricCardProps = {
  segments: MetricSegments;
  children: ReactNode;
};

export function MetricCard({ segments, children }: MetricCardProps) {
  const headerItems = getProtocolHeaderItems(segments);

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader className="gap-1 p-4 pb-1">
        <div className="flex flex-wrap gap-3">
          {headerItems.map(({ key, value, color, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {formatMetricValue(segments.metric, value)}
              </span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        {segments.x402 === 0 && segments.mpp === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            No data
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
