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
      className="inline-flex h-8 w-fit shrink-0 items-center justify-center rounded-lg bg-muted p-0.5 text-muted-foreground sm:h-10 sm:p-1"
    >
      {CHART_OPTIONS.map(({ value: optionValue, label, icon: Icon }) => (
        <button
          key={optionValue}
          type="button"
          aria-label={label}
          aria-pressed={value === optionValue}
          onClick={() => onChange(optionValue)}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:px-4 sm:py-1.5 sm:text-sm',
            value === optionValue && 'bg-background text-foreground shadow-sm',
          )}
        >
          <Icon className="size-3.5 sm:size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
