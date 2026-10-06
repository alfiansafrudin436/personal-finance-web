'use client';

import { formatCurrency, formatMonth } from '@/lib/format';

type TooltipEntry = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
};

interface IChartTooltip {
  active?: boolean;
  label?: string | number;
  payload?: TooltipEntry[];
  /** Renders the label as a month when the axis is a `YYYY-MM` period. */
  labelAsMonth?: boolean;
}

/**
 * Shared tooltip. Values are formatted as currency and the series name sits
 * next to a colored swatch, so identity never rests on the color alone.
 */
const ChartTooltip = ({
  active,
  label,
  payload,
  labelAsMonth,
}: IChartTooltip) => {
  if (!active || !payload?.length) return null;

  return (
    <div className='rounded-lg border border-border bg-popover px-3 py-2 shadow-md'>
      <p className='mb-1 text-xs font-medium text-muted-foreground'>
        {labelAsMonth && typeof label === 'string' ? formatMonth(label) : label}
      </p>
      <ul className='space-y-0.5'>
        {payload.map((entry) => (
          <li
            key={`${entry.dataKey}`}
            className='flex items-center gap-2 text-sm text-foreground'
          >
            <span
              aria-hidden
              className='h-2 w-2 shrink-0 rounded-full'
              style={{ backgroundColor: entry.color }}
            />
            <span className='text-muted-foreground'>{entry.name}</span>
            <span className='ml-auto font-medium tabular-nums'>
              {formatCurrency(entry.value ?? 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChartTooltip;
