'use client';

import CategoryChart from '@/components/charts/category-chart';
import TrendChart from '@/components/charts/trend-chart';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import StatCard from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CATEGORY_TYPE_LABELS,
  formatCurrency,
  formatDate,
  formatNumber,
  percentage,
  toNumber,
} from '@/lib/format';
import { CategoryType } from '@/types';

import { useHooks } from './hooks';

const ReportsPage = () => {
  const { data, methods } = useHooks();

  const breakdownTotal = data.categories.reduce(
    (sum, row) => sum + toNumber(row.total),
    0,
  );

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Laporan'
        description='Ringkasan pemasukan dan pengeluaran untuk rentang waktu pilihanmu.'
      />

      {data.error && (
        <div
          role='alert'
          className='flex items-start justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'
        >
          <span>{data.error}</span>
          <Button variant='outline' size='sm' onClick={methods.reload}>
            Coba lagi
          </Button>
        </div>
      )}

      {/* Filters sit in one row above the charts they control. */}
      <Card>
        <CardContent className='grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='report-start'>Dari tanggal</Label>
            <Input
              id='report-start'
              type='date'
              value={data.startDate}
              onChange={(event) => methods.setStartDate(event.target.value)}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='report-end'>Sampai tanggal</Label>
            <Input
              id='report-end'
              type='date'
              value={data.endDate}
              onChange={(event) => methods.setEndDate(event.target.value)}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='report-type'>Rincian untuk</Label>
            <Select
              value={data.type}
              onValueChange={(value) => methods.setType(value as CategoryType)}
            >
              <SelectTrigger id='report-type'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='expense'>Pengeluaran</SelectItem>
                <SelectItem value='income'>Pemasukan</SelectItem>
                <SelectItem value='transfer'>Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='report-months'>Panjang tren</Label>
            <Select
              value={`${data.months}`}
              onValueChange={(value) => methods.setMonths(Number(value))}
            >
              <SelectTrigger id='report-months'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='3'>3 bulan</SelectItem>
                <SelectItem value='6'>6 bulan</SelectItem>
                <SelectItem value='12'>12 bulan</SelectItem>
                <SelectItem value='24'>24 bulan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {data.isLoading ? (
        <div className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-3'>
            {[0, 1, 2].map((key) => (
              <Skeleton key={key} className='h-28 rounded-xl' />
            ))}
          </div>
          <Skeleton className='h-80 rounded-xl' />
        </div>
      ) : (
        <>
          <div className='grid gap-4 sm:grid-cols-3'>
            <StatCard
              label='Pemasukan'
              value={formatCurrency(data.summary?.totalIncome)}
              tone='positive'
            />
            <StatCard
              label='Pengeluaran'
              value={formatCurrency(data.summary?.totalExpense)}
              tone='negative'
            />
            <StatCard
              label='Selisih'
              value={formatCurrency(data.summary?.net)}
              hint={`${data.summary?.transactionCount ?? 0} transaksi`}
              tone={toNumber(data.summary?.net) < 0 ? 'negative' : 'positive'}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tren Pemasukan vs Pengeluaran</CardTitle>
              <CardDescription>{data.months} bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              {data.trend.length ? (
                <TrendChart data={data.trend} />
              ) : (
                <EmptyState title='Belum ada data tren' />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {CATEGORY_TYPE_LABELS[data.type]} per Kategori
              </CardTitle>
              <CardDescription>
                {formatDate(data.startDate)} – {formatDate(data.endDate)}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {data.categories.length ? (
                <>
                  <CategoryChart
                    data={data.categories}
                    tone={data.type === 'income' ? 'income' : 'expense'}
                  />

                  {/* The same numbers as a table, so the chart is never the
                      only way to read them. */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kategori</TableHead>
                        <TableHead className='text-right'>Transaksi</TableHead>
                        <TableHead className='text-right'>Porsi</TableHead>
                        <TableHead className='text-right'>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.categories.map((row) => (
                        <TableRow key={row.categoryId}>
                          <TableCell className='font-medium'>
                            {row.categoryName}
                          </TableCell>
                          <TableCell className='text-right tabular-nums text-muted-foreground'>
                            {formatNumber(row.transactionCount)}
                          </TableCell>
                          <TableCell className='text-right tabular-nums text-muted-foreground'>
                            {percentage(row.total, breakdownTotal)}%
                          </TableCell>
                          <TableCell className='text-right font-medium tabular-nums'>
                            {formatCurrency(row.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell className='font-semibold'>Total</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell className='text-right font-semibold tabular-nums'>
                          {formatCurrency(breakdownTotal)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              ) : (
                <EmptyState
                  title='Tidak ada data'
                  description='Belum ada transaksi pada rentang dan tipe ini.'
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
