'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, type ReactNode } from 'react';

import { ChartTypeToggle } from '@/components/charts/toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DashboardData, TimeframePanelData } from '@/lib/dashboard-data';
import { METRIC_LABELS, DESKTOP_CHART_MEDIA_QUERY, type ChartType } from '@/lib/metric-chart';
import { METRICS, TIMEFRAME_OPTIONS } from '@/lib/snapshot-helpers';
import type { MetricKey, Timeframe } from '@/lib/types';
import { useMediaQuery } from '@/lib/use-media-query';

const DynamicBarChart = dynamic(() =>
  import('@/components/charts/bar-chart').then((m) => m.MetricBarChart),
);

const DynamicPieChart = dynamic(() =>
  import('@/components/charts/pie-chart').then((m) => m.MetricPieChart),
);

type DashboardProps = {
  panels: DashboardData;
  children: ReactNode;
};

const DEFAULT_TIMEFRAME: Timeframe = 7;

function parseTimeframe(value: string | null): Timeframe {
  if (value === '1' || value === '7' || value === '30') return Number(value) as Timeframe;
  return DEFAULT_TIMEFRAME;
}

function parseChartType(value: string | null): ChartType | null {
  if (value === 'bar' || value === 'pie') return value;
  return null;
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
  if (chartType === 'bar') {
    return <DynamicBarChart metric={metric} {...stats} />;
  }

  return <DynamicPieChart metric={metric} {...stats} />;
}

function TimeframePanel({
  stats,
  chartType,
}: {
  stats: TimeframePanelData;
  chartType: ChartType;
}) {
  return (
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
  );
}

export function Dashboard({ panels, children }: DashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery(DESKTOP_CHART_MEDIA_QUERY);

  const timeframe = parseTimeframe(searchParams.get('tf'));
  const chartParam = parseChartType(searchParams.get('chart'));
  const chartType = chartParam ?? (isDesktop ? 'bar' : 'pie');

  const updateParams = useCallback(
    (updates: { tf?: Timeframe; chart?: ChartType | null }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.tf !== undefined) {
        params.set('tf', String(updates.tf));
      }

      if (updates.chart !== undefined) {
        if (updates.chart === null) {
          params.delete('chart');
        } else {
          params.set('chart', updates.chart);
        }
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <Tabs
      value={String(timeframe)}
      onValueChange={(value) => updateParams({ tf: parseTimeframe(value) })}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        {children}
        <div className="flex shrink-0 items-center gap-2">
          <ChartTypeToggle value={chartType} onChange={(value) => updateParams({ chart: value })} />
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
          <TimeframePanel stats={panels[value]} chartType={chartType} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
