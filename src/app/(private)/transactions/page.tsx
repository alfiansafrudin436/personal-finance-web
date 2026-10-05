'use client';

import {
  IconFilterOff,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';

import ConfirmDialog from '@/components/confirm-dialog';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { formatDate, formatNumber, formatSignedCurrency } from '@/lib/format';
import { CategoryType } from '@/types';

import TransactionForm from './transaction-form';
import { useHooks } from './hooks';

const ALL = 'all';

const TransactionsPage = () => {
  const { data, methods } = useHooks();

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Transaksi'
        description='Semua pemasukan, pengeluaran, dan transfer antar akun.'
        action={
          <Button onClick={methods.openCreate}>
            <IconPlus />
            Catat transaksi
          </Button>
        }
      />

      {data.error && (
        <div
          role='alert'
          className='flex items-start justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'
        >
          <span>{data.error}</span>
          <button
            type='button'
            onClick={methods.dismissError}
            className='shrink-0 font-medium underline'
          >
            Tutup
          </button>
        </div>
      )}

      <Card>
        <CardContent className='grid gap-3 p-4 md:grid-cols-3 xl:grid-cols-6'>
          <div className='space-y-1.5 xl:col-span-2'>
            <Label htmlFor='filter-search'>Cari deskripsi</Label>
            <Input
              id='filter-search'
              value={data.filters.search}
              onChange={(event) =>
                methods.setFilter('search', event.target.value)
              }
              placeholder='Cari transaksi...'
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='filter-start'>Dari tanggal</Label>
            <Input
              id='filter-start'
              type='date'
              value={data.filters.startDate}
              onChange={(event) =>
                methods.setFilter('startDate', event.target.value)
              }
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='filter-end'>Sampai tanggal</Label>
            <Input
              id='filter-end'
              type='date'
              value={data.filters.endDate}
              onChange={(event) =>
                methods.setFilter('endDate', event.target.value)
              }
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='filter-type'>Tipe</Label>
            <Select
              value={data.filters.type}
              onValueChange={(value) =>
                methods.setFilter('type', value as CategoryType | 'all')
              }
            >
              <SelectTrigger id='filter-type'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Semua tipe</SelectItem>
                <SelectItem value='income'>Pemasukan</SelectItem>
                <SelectItem value='expense'>Pengeluaran</SelectItem>
                <SelectItem value='transfer'>Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='filter-account'>Akun</Label>
            <Select
              value={data.filters.accountId || ALL}
              onValueChange={(value) =>
                methods.setFilter('accountId', value === ALL ? '' : value)
              }
            >
              <SelectTrigger id='filter-account'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Semua akun</SelectItem>
                {data.accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.hasFilters && (
            <div className='flex items-end md:col-span-3 xl:col-span-6'>
              <Button
                variant='outline'
                size='sm'
                onClick={methods.resetFilters}
              >
                <IconFilterOff />
                Reset filter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-0'>
          {data.isLoading ? (
            <div className='space-y-3 p-5'>
              {[0, 1, 2, 3, 4].map((key) => (
                <Skeleton key={key} className='h-10' />
              ))}
            </div>
          ) : data.transactions.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Akun</TableHead>
                  <TableHead className='text-right'>Jumlah</TableHead>
                  <TableHead className='w-px' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.transactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className='whitespace-nowrap text-muted-foreground'>
                      {formatDate(trx.transactionDate)}
                    </TableCell>
                    <TableCell className='max-w-[220px]'>
                      <p className='truncate font-medium'>
                        {trx.description || trx.categoryName}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={trx.categoryType}>
                        {trx.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {trx.toAccountName
                        ? `${trx.accountName} → ${trx.toAccountName}`
                        : trx.accountName}
                    </TableCell>
                    <TableCell className='whitespace-nowrap text-right font-medium tabular-nums'>
                      {formatSignedCurrency(trx.amount, trx.categoryType)}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          aria-label='Ubah transaksi'
                          onClick={() => methods.openEdit(trx)}
                        >
                          <IconPencil />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          aria-label='Hapus transaksi'
                          onClick={() => methods.setDeleting(trx)}
                        >
                          <IconTrash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className='p-5'>
              <EmptyState
                title='Belum ada transaksi'
                description={
                  data.hasFilters
                    ? 'Tidak ada transaksi yang cocok dengan filter ini.'
                    : 'Mulai catat pemasukan dan pengeluaran kamu.'
                }
                action={
                  data.hasFilters ? (
                    <Button variant='outline' onClick={methods.resetFilters}>
                      Reset filter
                    </Button>
                  ) : (
                    <Button onClick={methods.openCreate}>
                      Catat transaksi
                    </Button>
                  )
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      {data.pagination.totalPages > 1 && (
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p className='text-sm text-muted-foreground'>
            Halaman {data.pagination.page} dari {data.pagination.totalPages} ·{' '}
            {formatNumber(data.pagination.total)} transaksi
          </p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={data.page <= 1}
              onClick={() => methods.setPage(data.page - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled={data.page >= data.pagination.totalPages}
              onClick={() => methods.setPage(data.page + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}

      <TransactionForm data={data} methods={methods} />

      <ConfirmDialog
        open={Boolean(data.deleting)}
        onOpenChange={(open) => !open && methods.setDeleting(null)}
        title='Hapus transaksi ini?'
        description='Saldo akun akan dikembalikan seperti sebelum transaksi ini dicatat.'
        isLoading={data.isDeleting}
        onConfirm={methods.confirmDelete}
      />
    </div>
  );
};

export default TransactionsPage;
