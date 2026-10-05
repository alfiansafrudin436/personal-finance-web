'use client';

import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';

import ConfirmDialog from '@/components/confirm-dialog';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import StatCard from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_OPTIONS,
  formatCurrency,
} from '@/lib/format';
import { AccountType } from '@/types';

import { useHooks } from './hooks';

const AccountsPage = () => {
  const { data, methods } = useHooks();

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Akun'
        description='Dompet, rekening bank, dan kartu yang kamu pakai.'
        action={
          <Button onClick={methods.openCreate}>
            <IconPlus />
            Tambah akun
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

      <div className='grid gap-4 sm:grid-cols-2'>
        <StatCard
          label='Total Saldo'
          value={formatCurrency(data.totalBalance)}
          hint='Hanya akun aktif'
        />
        <Card>
          <CardContent className='flex items-center justify-between gap-3 p-5'>
            <div>
              <p className='text-sm font-medium'>Tampilkan akun diarsipkan</p>
              <p className='text-xs text-muted-foreground'>
                Akun yang diarsipkan tetap menyimpan riwayat transaksinya.
              </p>
            </div>
            <input
              type='checkbox'
              checked={data.includeArchived}
              onChange={(event) =>
                methods.setIncludeArchived(event.target.checked)
              }
              className='h-4 w-4 shrink-0 accent-primary'
              aria-label='Tampilkan akun diarsipkan'
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className='p-0'>
          {data.isLoading ? (
            <div className='space-y-3 p-5'>
              {[0, 1, 2].map((key) => (
                <Skeleton key={key} className='h-10' />
              ))}
            </div>
          ) : data.accounts.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead className='text-right'>Saldo</TableHead>
                  <TableHead className='w-px' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium'>{account.name}</span>
                        {account.isArchived && (
                          <Badge variant='secondary'>Diarsipkan</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {ACCOUNT_TYPE_LABELS[account.type]}
                    </TableCell>
                    <TableCell className='text-right font-medium tabular-nums'>
                      {formatCurrency(account.balance, account.currency)}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => methods.toggleArchive(account)}
                        >
                          {account.isArchived ? 'Aktifkan' : 'Arsipkan'}
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          aria-label={`Ubah ${account.name}`}
                          onClick={() => methods.openEdit(account)}
                        >
                          <IconPencil />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          aria-label={`Hapus ${account.name}`}
                          onClick={() => methods.setDeleting(account)}
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
                title='Belum ada akun'
                description='Mulai dengan menambahkan dompet atau rekening bank.'
                action={
                  <Button onClick={methods.openCreate}>Tambah akun</Button>
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={data.isFormOpen} onOpenChange={methods.setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {data.editing ? 'Ubah Akun' : 'Tambah Akun'}
            </DialogTitle>
            <DialogDescription>
              {data.editing
                ? 'Saldo mengikuti transaksi yang tercatat, jadi tidak bisa diubah di sini.'
                : 'Saldo awal bisa diisi sekarang atau dibiarkan nol.'}
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
              <Label htmlFor='account-name'>Nama akun</Label>
              <Input
                id='account-name'
                value={data.form.name}
                onChange={(event) =>
                  methods.setField('name', event.target.value)
                }
                placeholder='Contoh: BCA, Dompet, GoPay'
                autoFocus
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='account-type'>Tipe</Label>
                <Select
                  value={data.form.type}
                  onValueChange={(value) =>
                    methods.setField('type', value as AccountType)
                  }
                >
                  <SelectTrigger id='account-type'>
                    <SelectValue placeholder='Pilih tipe' />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='account-currency'>Mata uang</Label>
                <Input
                  id='account-currency'
                  value={data.form.currency}
                  onChange={(event) =>
                    methods.setField(
                      'currency',
                      event.target.value.toUpperCase(),
                    )
                  }
                  maxLength={3}
                  placeholder='IDR'
                />
              </div>
            </div>

            {!data.editing && (
              <div className='space-y-2'>
                <Label htmlFor='account-balance'>Saldo awal</Label>
                <Input
                  id='account-balance'
                  type='number'
                  step='0.01'
                  value={data.form.balance}
                  onChange={(event) =>
                    methods.setField('balance', event.target.value)
                  }
                  placeholder='0'
                />
                <p className='text-xs text-muted-foreground'>
                  Boleh negatif, misalnya untuk sisa tagihan kartu kredit.
                </p>
              </div>
            )}

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
        title={`Hapus akun ${data.deleting?.name ?? ''}?`}
        description='Akun yang masih punya transaksi tidak bisa dihapus, arsipkan saja.'
        isLoading={data.isDeleting}
        onConfirm={methods.confirmDelete}
      />
    </div>
  );
};

export default AccountsPage;
