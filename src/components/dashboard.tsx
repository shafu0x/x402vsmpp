'use client';

import { useState } from 'react';

import { MetricBarChart } from '@/components/charts/bar-chart';
import { MetricPieChart } from '@/components/charts/pie-chart';
import { ChartTypeToggle } from '@/components/charts/toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { METRIC_LABELS, DESKTOP_CHART_MEDIA_QUERY, type ChartType } from '@/lib/metric-chart';
import { getStatsForTimeframe, METRICS, TIMEFRAME_OPTIONS } from '@/lib/snapshot-helpers';
import { useMediaQuery } from '@/lib/use-media-query';
import type { SnapshotSet, Timeframe } from '@/lib/types';

type DashboardProps = {
  snapshot: SnapshotSet;
};

function TimeframePanel({
  snapshot,
  timeframe,
  chartType,
}: {
  snapshot: SnapshotSet;
  timeframe: Timeframe;
  chartType: ChartType;
}) {
  const stats = getStatsForTimeframe(snapshot, timeframe);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {METRICS.map((metric) => (
        <div key={metric} className="flex flex-col gap-3">
          {chartType === 'bar' ? (
            <MetricBarChart metric={metric} {...stats} />
          ) : (
            <MetricPieChart metric={metric} {...stats} />
          )}
          <h2 className="text-center text-xs font-medium text-muted-foreground">
            {METRIC_LABELS[metric]}
          </h2>
        </div>
      ))}
    </div>
  );
}

export function Dashboard({ snapshot }: DashboardProps) {
  const isDesktop = useMediaQuery(DESKTOP_CHART_MEDIA_QUERY);
  const [chartOverride, setChartOverride] = useState<ChartType | null>(null);
  const chartType = chartOverride ?? (isDesktop ? 'bar' : 'pie');

  return (
    <Tabs defaultValue="7" className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">x402 vs MPP</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Protocol comparison across transactions, volume, buyers, and sellers.
          </p>
        </header>
        <div className="flex shrink-0 items-center gap-2">
          <ChartTypeToggle value={chartType} onChange={setChartOverride} />
          <TabsList>
            {TIMEFRAME_OPTIONS.map(({ value, label }) => (
              <TabsTrigger key={value} value={String(value)}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
      {TIMEFRAME_OPTIONS.map(({ value }) => (
        <TabsContent key={value} value={String(value)}>
          <TimeframePanel snapshot={snapshot} timeframe={value} chartType={chartType} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
