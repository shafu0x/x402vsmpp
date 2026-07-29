'use client';

import * as React from 'react';
import { ResponsiveContainer } from 'recharts';

import { cn } from '@/lib/utils';

const THEMES = { light: '', dark: '.dark' } as const;

type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof ResponsiveContainer>['children'];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;

  return (
    <div
      data-chart={chartId}
      className={cn(
        'flex aspect-auto justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke="#ccc"]]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-none [&_.recharts-surface]:outline-none',
        className,
      )}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item.color);

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, item]) => `  --color-${key}: ${item.color};`).join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  );
}

export { ChartContainer };
