'use client';

import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';

import ConfirmDialog from '@/components/confirm-dialog';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import StatCard from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  formatCurrency,
  formatMonth,
  percentage,
  toNumber,
} from '@/lib/format';
import { cn } from '@/lib/utils';

import { useHooks } from './hooks';

const BudgetsPage = () => {
  const { data, methods } = useHooks();

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Anggaran'
        description={`Batas pengeluaran per kategori untuk ${formatMonth(data.period)}.`}
        action={
          <Button
            onClick={methods.openCreate}
            disabled={!data.categories.length}
          >
            <IconPlus />
            Tambah anggaran
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
        <CardContent className='flex flex-wrap items-end gap-3 p-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='budget-period'>Periode</Label>
            <Input
              id='budget-period'
              type='month'
              value={data.period}
              onChange={(event) => methods.setPeriod(event.target.value)}
              className='w-44'
            />
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-4 sm:grid-cols-3'>
        <StatCard
          label='Total Anggaran'
          value={formatCurrency(data.totals.planned)}
        />
        <StatCard
          label='Terpakai'
          value={formatCurrency(data.totals.spent)}
          tone='negative'
        />
        <StatCard
          label='Sisa'
          value={formatCurrency(data.totals.remaining)}
          tone={data.totals.remaining < 0 ? 'negative' : 'positive'}
        />
      </div>

      {data.isLoading ? (
        <div className='space-y-3'>
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className='h-24 rounded-xl' />
          ))}
        </div>
      ) : data.budgets.length ? (
        <div className='space-y-3'>
          {data.budgets.map((budget) => {
            const used = percentage(budget.spent, budget.amount);
            const remaining = toNumber(budget.remaining);
            const isOver = remaining < 0;

            return (
              <Card key={budget.id}>
                <CardContent className='p-4'>
                  <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div className='flex min-w-0 items-center gap-3'>
                      <span
                        aria-hidden
                        className={cn(
                          'h-8 w-8 shrink-0 rounded-lg',
                          !budget.categoryColor && 'bg-muted',
                        )}
                        style={
                          budget.categoryColor
                            ? { backgroundColor: budget.categoryColor }
                            : undefined
                        }
                      />
                      <div className='min-w-0'>
                        <p className='truncate font-medium'>
                          {budget.categoryName}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {formatCurrency(budget.spent)} dari{' '}
                          {formatCurrency(budget.amount)}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div className='text-right'>
                        <p
                          className={cn(
                            'font-medium tabular-nums',
                            isOver ? 'text-destructive' : 'text-foreground',
                          )}
                        >
                          {isOver ? 'Lebih ' : 'Sisa '}
                          {formatCurrency(Math.abs(remaining))}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {used}% terpakai
                        </p>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        aria-label={`Ubah anggaran ${budget.categoryName}`}
                        onClick={() => methods.openEdit(budget)}
                      >
                        <IconPencil />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        aria-label={`Hapus anggaran ${budget.categoryName}`}
                        onClick={() => methods.setDeleting(budget)}
                      >
                        <IconTrash />
                      </Button>
                    </div>
                  </div>

                  <div
                    className='mt-3 h-2 w-full overflow-hidden rounded-full bg-muted'
                    role='progressbar'
                    aria-valuenow={Math.min(used, 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Anggaran ${budget.categoryName} terpakai ${used} persen`}
                  >
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        isOver ? 'bg-destructive' : 'bg-primary',
                      )}
                      style={{ width: `${Math.min(used, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title='Belum ada anggaran'
          description={`Tetapkan batas pengeluaran untuk ${formatMonth(data.period)}.`}
          action={
            <Button
              onClick={methods.openCreate}
              disabled={!data.categories.length}
            >
              Tambah anggaran
            </Button>
          }
        />
      )}

      <Dialog open={data.isFormOpen} onOpenChange={methods.setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {data.editing ? 'Ubah Anggaran' : 'Tambah Anggaran'}
            </DialogTitle>
            <DialogDescription>
              Anggaran berlaku untuk {formatMonth(data.period)}.
            </DialogDescription>
          </DialogHeader>

          <form
            className='space-y-4'
            onSubmit={(event) => {
              event.preventDefault();
              void methods.submit();
            }}
          >
            <div className='space-y-2'>
              <Label htmlFor='budget-category'>Kategori pengeluaran</Label>
              <Select
                value={data.form.categoryId}
                onValueChange={(value) => methods.setField('categoryId', value)}
                disabled={Boolean(data.editing)}
              >
                <SelectTrigger id='budget-category'>
                  <SelectValue placeholder='Pilih kategori' />
                </SelectTrigger>
                <SelectContent>
                  {data.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='budget-amount'>Jumlah anggaran</Label>
              <Input
                id='budget-amount'
                type='number'
                min='0'
                step='0.01'
                value={data.form.amount}
                onChange={(event) =>
                  methods.setField('amount', event.target.value)
                }
                placeholder='0'
              />
            </div>

            {data.formError && (
              <p role='alert' className='text-sm text-destructive'>
                {data.formError}
              </p>
            )}

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => methods.setIsFormOpen(false)}
                disabled={data.isSaving}
              >
                Batal
              </Button>
              <Button type='submit' disabled={data.isSaving}>
                {data.isSaving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(data.deleting)}
        onOpenChange={(open) => !open && methods.setDeleting(null)}
        title={`Hapus anggaran ${data.deleting?.categoryName ?? ''}?`}
        description='Transaksi yang sudah tercatat tidak terpengaruh.'
        isLoading={data.isDeleting}
        onConfirm={methods.confirmDelete}
      />
    </div>
  );
};

export default BudgetsPage;
