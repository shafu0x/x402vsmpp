'use client';

import { ChartNoAxesColumn, ChartPie } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ChartType } from '@/lib/metric-chart';

type ChartTypeToggleProps = {
  value: ChartType;
  onChange: (value: ChartType) => void;
};

export function ChartTypeToggle({ value, onChange }: ChartTypeToggleProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as ChartType)}>
      <TabsList className="shrink-0">
        <TabsTrigger value="bar" aria-label="Bar chart">
          <ChartNoAxesColumn className="size-4" />
        </TabsTrigger>
        <TabsTrigger value="pie" aria-label="Pie chart">
          <ChartPie className="size-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
