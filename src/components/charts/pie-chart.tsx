'use client';

import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { MetricCard } from '@/components/charts/card';
import { MetricSegmentTooltip } from '@/components/charts/tooltip';
import { ChartContainer } from '@/components/ui/chart';
import {
  CHART_ANIMATION_DURATION,
  CHART_CONFIG,
  getMetricSegments,
  type MetricChartProps,
  toSegmentData,
} from '@/lib/metric-chart';

export function MetricPieChart(props: MetricChartProps) {
  const segments = getMetricSegments(props);
  const pieData = toSegmentData(segments).filter((datum) => datum.value > 0);

  return (
    <MetricCard segments={segments}>
      <ChartContainer config={CHART_CONFIG} className="mx-auto h-40 w-full max-w-42">
        <PieChart margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0]?.payload;
              if (!item) return null;

              return (
                <MetricSegmentTooltip
                  metric={segments.metric}
                  segmentKey={item.key}
                  value={item.value}
                  color={item.fill}
                  percentage={segments.total > 0 ? (item.value / segments.total) * 100 : undefined}
                />
              );
            }}
          />
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={72}
            strokeWidth={0}
            animationDuration={CHART_ANIMATION_DURATION}
          >
            {pieData.map((datum) => (
              <Cell key={datum.key} fill={datum.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </MetricCard>
  );
}
