'use client';

import { ChartNoAxesColumn, ChartPie } from 'lucide-react';

import type { ChartType } from '@/lib/metric-chart';
import { cn } from '@/lib/utils';

type ChartTypeToggleProps = {
  value: ChartType;
  onChange: (value: ChartType) => void;
};

const CHART_OPTIONS: { value: ChartType; label: string; icon: typeof ChartNoAxesColumn }[] = [
  { value: 'pie', label: 'Pie chart', icon: ChartPie },
  { value: 'bar', label: 'Bar chart', icon: ChartNoAxesColumn },
];

export function ChartTypeToggle({ value, onChange }: ChartTypeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Chart type"
      className="inline-flex h-10 w-fit shrink-0 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
    >
      {CHART_OPTIONS.map(({ value: optionValue, label, icon: Icon }) => (
        <button
          key={optionValue}
          type="button"
          aria-label={label}
          aria-pressed={value === optionValue}
          onClick={() => onChange(optionValue)}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
            value === optionValue && 'bg-background text-foreground shadow-sm',
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
