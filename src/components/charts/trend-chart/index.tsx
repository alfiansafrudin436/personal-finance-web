'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { TrendPoint } from '@/api/reports';
import ChartTooltip from '@/components/charts/chart-tooltip';
import { formatCurrencyCompact, formatMonth, toNumber } from '@/lib/format';

interface ITrendChart {
  data: TrendPoint[];
}

/**
 * Income against expense over time. Both series are currency, so they share
 * one y-axis; a second scale would make the two lines incomparable.
 */
const TrendChart = ({ data }: ITrendChart) => {
  const points = data.map((point) => ({
    period: point.period,
    income: toNumber(point.totalIncome),
    expense: toNumber(point.totalExpense),
  }));

  return (
    <div className='h-72 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={points}
          margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
        >
          <CartesianGrid
            vertical={false}
            stroke='var(--color-border)'
            strokeDasharray='3 3'
          />
          <XAxis
            dataKey='period'
            tickFormatter={formatMonth}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
          />
          <YAxis
            tickFormatter={(value: number) => formatCurrencyCompact(value)}
            tickLine={false}
            axisLine={false}
            width={72}
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
          />
          <Tooltip
            content={<ChartTooltip labelAsMonth />}
            cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
          />
          <Legend
            verticalAlign='top'
            align='right'
            height={32}
            iconType='plainline'
            wrapperStyle={{ fontSize: 12 }}
          />
          <Line
            type='monotone'
            dataKey='income'
            name='Pemasukan'
            stroke='var(--color-chart-income)'
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: 'var(--color-background)',
            }}
          />
          <Line
            type='monotone'
            dataKey='expense'
            name='Pengeluaran'
            stroke='var(--color-chart-expense)'
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: 'var(--color-background)',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
