'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a ChartContainer');
  }
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          'flex aspect-auto justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke="#ccc"]]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-none [&_.recharts-surface]:outline-none',
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
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

function ChartTooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{
    dataKey?: string | number;
    value?: number;
    color?: string;
    payload?: { fill?: string };
  }>;
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      {payload.map((item) => {
        const key = String(item.dataKey ?? '');
        const itemConfig = config[key];
        const color = item.payload?.fill ?? item.color ?? itemConfig?.color;
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{itemConfig?.label ?? key}</span>
            <span className="font-mono font-medium">{item.value?.toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
}

export { ChartContainer, ChartTooltipContent };
