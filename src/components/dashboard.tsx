'use client';

import dynamic from 'next/dynamic';
import { useState, type ReactNode } from 'react';

import { MetricCardSkeleton } from '@/components/charts/chart-skeleton';
import { ChartTypeToggle } from '@/components/charts/toggle';
import { TopVolumeTable } from '@/components/top-volume-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DashboardData, TimeframePanelData } from '@/lib/dashboard-data';
import { METRIC_LABELS, type ChartType } from '@/lib/metric-chart';
import { METRICS, TIMEFRAME_OPTIONS } from '@/lib/snapshot-helpers';
import type { MetricKey, Timeframe } from '@/lib/types';

const DynamicBarChart = dynamic(
  () => import('@/components/charts/bar-chart').then((m) => m.MetricBarChart),
  { ssr: false, loading: () => <MetricCardSkeleton /> },
);

const DynamicPieChart = dynamic(
  () => import('@/components/charts/pie-chart').then((m) => m.MetricPieChart),
  { ssr: false, loading: () => <MetricCardSkeleton /> },
);

type DashboardProps = {
  panels: DashboardData;
  children: ReactNode;
};

const DEFAULT_TIMEFRAME: Timeframe = 7;
const DEFAULT_CHART_TYPE: ChartType = 'pie';

function parseTimeframe(value: string): Timeframe {
  if (value === '1' || value === '7' || value === '30') return Number(value) as Timeframe;
  return DEFAULT_TIMEFRAME;
}

function MetricChart({
  chartType,
  metric,
  stats,
}: {
  chartType: ChartType;
  metric: MetricKey;
  stats: TimeframePanelData;
}) {
  const chartProps = {
    metric,
    x402Base: stats.x402Base,
    x402Solana: stats.x402Solana,
    mpp: stats.mpp,
  };

  if (chartType === 'bar') {
    return <DynamicBarChart {...chartProps} />;
  }

  return <DynamicPieChart {...chartProps} />;
}

function TimeframePanel({ stats, chartType }: { stats: TimeframePanelData; chartType: ChartType }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <div key={metric} className="flex flex-col gap-3">
            <MetricChart chartType={chartType} metric={metric} stats={stats} />
            <h2 className="text-center text-xs font-medium text-muted-foreground">
              {METRIC_LABELS[metric]}
            </h2>
          </div>
        ))}
      </div>
      <TopVolumeTable entries={stats.topVolume} />
    </div>
  );
}

export function Dashboard({ panels, children }: DashboardProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>(DEFAULT_TIMEFRAME);
  const [chartType, setChartType] = useState<ChartType>(DEFAULT_CHART_TYPE);

  return (
    <Tabs
      value={String(timeframe)}
      onValueChange={(value) => setTimeframe(parseTimeframe(value))}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        {children}
        <div className="flex shrink-0 flex-col items-start gap-2 sm:flex-row sm:items-center">
          <TabsList className="sm:order-2">
            {TIMEFRAME_OPTIONS.map(({ value, label }) => (
              <TabsTrigger key={value} value={String(value)}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="sm:order-1">
            <ChartTypeToggle value={chartType} onChange={setChartType} />
          </div>
        </div>
      </div>
      {TIMEFRAME_OPTIONS.map(({ value }) => (
        <TabsContent key={value} value={String(value)}>
          <TimeframePanel stats={panels[value]} chartType={chartType} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
