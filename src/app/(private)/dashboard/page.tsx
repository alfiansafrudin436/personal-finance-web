'use client';

import Link from 'next/link';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconReceipt,
  IconWallet,
} from '@tabler/icons-react';

import CategoryChart from '@/components/charts/category-chart';
import TrendChart from '@/components/charts/trend-chart';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import StatCard from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ACCOUNT_TYPE_LABELS,
  CATEGORY_TYPE_LABELS,
  formatCurrency,
  formatDate,
  formatMonth,
  formatSignedCurrency,
  toNumber,
} from '@/lib/format';

import { useHooks } from './hooks';

const DashboardPage = () => {
  const { data, methods } = useHooks();

  if (data.isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-9 w-48' />
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className='h-28 rounded-xl' />
          ))}
        </div>
        <Skeleton className='h-80 rounded-xl' />
      </div>
    );
  }

  if (data.error) {
    return (
      <div className='space-y-4'>
        <PageHeader title='Dashboard' />
        <EmptyState
          title='Gagal memuat dashboard'
          description={data.error}
          action={<Button onClick={methods.reload}>Coba lagi</Button>}
        />
      </div>
    );
  }

  const net = toNumber(data.summary?.net);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Dashboard'
        description={
          data.summary
            ? `Ringkasan ${formatMonth(data.summary.period)}`
            : undefined
        }
        action={
          <Button asChild>
            <Link href='/transactions'>Catat transaksi</Link>
          </Button>
        }
      />

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          label='Total Saldo'
          value={formatCurrency(data.dashboard?.totalBalance)}
          hint={`${data.accounts.length} akun aktif`}
          icon={<IconWallet className='h-5 w-5' />}
        />
        <StatCard
          label='Pemasukan Bulan Ini'
          value={formatCurrency(data.summary?.totalIncome)}
          tone='positive'
          icon={<IconArrowUpRight className='h-5 w-5' />}
        />
        <StatCard
          label='Pengeluaran Bulan Ini'
          value={formatCurrency(data.summary?.totalExpense)}
          tone='negative'
          icon={<IconArrowDownRight className='h-5 w-5' />}
        />
        <StatCard
          label='Selisih Bulan Ini'
          value={formatCurrency(data.summary?.net)}
          hint={`${data.summary?.transactionCount ?? 0} transaksi`}
          tone={net < 0 ? 'negative' : 'positive'}
          icon={<IconReceipt className='h-5 w-5' />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pemasukan vs Pengeluaran</CardTitle>
          <CardDescription>6 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          {data.trend.length ? (
            <TrendChart data={data.trend} />
          ) : (
            <EmptyState title='Belum ada data untuk ditampilkan' />
          )}
        </CardContent>
      </Card>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran per Kategori</CardTitle>
            <CardDescription>Bulan ini, 5 kategori terbesar</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topCategories.length ? (
              <CategoryChart data={data.topCategories} />
            ) : (
              <EmptyState title='Belum ada pengeluaran bulan ini' />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saldo per Akun</CardTitle>
            <CardDescription>Akun yang masih aktif</CardDescription>
          </CardHeader>
          <CardContent>
            {data.accounts.length ? (
              <ul className='divide-y divide-border'>
                {data.accounts.map((account) => (
                  <li
                    key={account.id}
                    className='flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0'
                  >
                    <div className='min-w-0'>
                      <p className='truncate font-medium'>{account.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {ACCOUNT_TYPE_LABELS[account.type]}
                      </p>
                    </div>
                    <span className='shrink-0 font-medium tabular-nums'>
                      {formatCurrency(account.balance, account.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title='Belum ada akun'
                description='Tambahkan akun untuk mulai mencatat transaksi.'
                action={
                  <Button asChild variant='outline'>
                    <Link href='/accounts'>Kelola akun</Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className='flex-row items-center justify-between'>
          <div>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <CardDescription>5 transaksi terakhir</CardDescription>
          </div>
          <Button asChild variant='ghost' size='sm'>
            <Link href='/transactions'>Lihat semua</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {data.recentTransactions.length ? (
            <ul className='divide-y divide-border'>
              {data.recentTransactions.map((trx) => (
                <li
                  key={trx.id}
                  className='flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0'
                >
                  <div className='min-w-0'>
                    <p className='truncate font-medium'>
                      {trx.description || trx.categoryName}
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {formatDate(trx.transactionDate)} · {trx.accountName}
                    </p>
                  </div>
                  <div className='flex shrink-0 items-center gap-3'>
                    <Badge variant={trx.categoryType}>
                      {CATEGORY_TYPE_LABELS[trx.categoryType]}
                    </Badge>
                    <span className='font-medium tabular-nums'>
                      {formatSignedCurrency(trx.amount, trx.categoryType)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title='Belum ada transaksi'
              description='Transaksi yang kamu catat akan muncul di sini.'
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
