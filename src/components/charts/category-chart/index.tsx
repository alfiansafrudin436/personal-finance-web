'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CategoryBreakdown } from '@/api/reports';
import ChartTooltip from '@/components/charts/chart-tooltip';
import { formatCurrencyCompact, toNumber } from '@/lib/format';

interface ICategoryChart {
  data: CategoryBreakdown[];
  /** Colors the bars; a category report is a single measure, so one hue. */
  tone?: 'income' | 'expense';
}

/**
 * Magnitude per category as horizontal bars rather than a pie: comparing bar
 * lengths is far easier than comparing angles, and long category names fit.
 * One series, so no legend — the card title names the measure.
 */
const CategoryChart = ({ data, tone = 'expense' }: ICategoryChart) => {
  const color =
    tone === 'income'
      ? 'var(--color-chart-income)'
      : 'var(--color-chart-expense)';

  const points = data.map((row) => ({
    name: row.categoryName,
    total: toNumber(row.total),
    color: row.categoryColor ?? color,
  }));

  // Each bar needs vertical room of its own, so the plot grows with the rows
  // instead of squeezing them together.
  const height = Math.max(200, points.length * 44 + 40);

  return (
    <div className='w-full' style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={points}
          layout='vertical'
          margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
          barCategoryGap={8}
        >
          <CartesianGrid
            horizontal={false}
            stroke='var(--color-border)'
            strokeDasharray='3 3'
          />
          <XAxis
            type='number'
            tickFormatter={(value: number) => formatCurrencyCompact(value)}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
          />
          <YAxis
            type='category'
            dataKey='name'
            width={120}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }}
          />
          <Bar
            dataKey='total'
            name='Total'
            radius={[0, 4, 4, 0]}
            maxBarSize={20}
          >
            {points.map((point) => (
              <Cell key={point.name} fill={point.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
