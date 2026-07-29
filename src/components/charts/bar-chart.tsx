'use client';

import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';

import { MetricCard } from '@/components/charts/card';
import { MetricSegmentTooltip, METRIC_TOOLTIP_WRAPPER_STYLE } from '@/components/charts/tooltip';
import { ChartContainer } from '@/components/ui/chart';
import {
  CHART_ANIMATION_BEGIN,
  CHART_ANIMATION_DURATION,
  CHART_ANIMATION_EASING,
  CHART_CONFIG,
  getMetricSegments,
  type MetricChartProps,
  type SegmentKey,
} from '@/lib/metric-chart';

const BAR_SIZE = 56;

export function MetricBarChart(props: MetricChartProps) {
  const segments = getMetricSegments(props);

  const chartData = [
    { label: 'x402', base: segments.base, solana: segments.solana, mpp: 0 },
    { label: 'MPP', base: 0, solana: 0, mpp: segments.mpp },
  ];

  return (
    <MetricCard segments={segments}>
      <ChartContainer config={CHART_CONFIG} className="mx-auto h-40 w-full max-w-42">
        <BarChart
          data={chartData}
          barCategoryGap={20}
          margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
        >
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={{ fontSize: 11, dy: 4 }}
          />
          <YAxis hide domain={[0, 'auto']} />
          <Tooltip
            shared={false}
            cursor={{ fill: 'transparent' }}
            wrapperStyle={METRIC_TOOLTIP_WRAPPER_STYLE}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0];
              const segmentKey = item?.dataKey as SegmentKey;
              const value = Number(item?.value ?? 0);

              if (!segmentKey || value === 0) return null;

              return (
                <MetricSegmentTooltip
                  metric={segments.metric}
                  segmentKey={segmentKey}
                  value={value}
                  color={item?.color}
                />
              );
            }}
          />
          <Bar
            stackId="all"
            dataKey="base"
            fill={CHART_CONFIG.base.color}
            radius={[0, 0, 0, 0]}
            barSize={BAR_SIZE}
            activeBar={{ fillOpacity: 0.75 }}
            animationBegin={CHART_ANIMATION_BEGIN}
            animationDuration={CHART_ANIMATION_DURATION}
            animationEasing={CHART_ANIMATION_EASING}
          />
          <Bar
            stackId="all"
            dataKey="solana"
            fill={CHART_CONFIG.solana.color}
            radius={[4, 4, 0, 0]}
            barSize={BAR_SIZE}
            activeBar={{ fillOpacity: 0.75 }}
            animationBegin={CHART_ANIMATION_BEGIN}
            animationDuration={CHART_ANIMATION_DURATION}
            animationEasing={CHART_ANIMATION_EASING}
          />
          <Bar
            stackId="all"
            dataKey="mpp"
            fill={CHART_CONFIG.mpp.color}
            radius={[4, 4, 0, 0]}
            barSize={BAR_SIZE}
            activeBar={{ fillOpacity: 0.75 }}
            animationBegin={CHART_ANIMATION_BEGIN}
            animationDuration={CHART_ANIMATION_DURATION}
            animationEasing={CHART_ANIMATION_EASING}
          />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
}
