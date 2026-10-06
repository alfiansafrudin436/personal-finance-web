'use client';

import { Button } from '@/components/ui/button';
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORY_TYPE_LABELS } from '@/lib/format';
import { CategoryType } from '@/types';

import { useHooks } from './hooks';

type Hooks = ReturnType<typeof useHooks>;

interface ITransactionForm {
  data: Hooks['data'];
  methods: Hooks['methods'];
}

const TYPE_ORDER: CategoryType[] = ['expense', 'income', 'transfer'];

/**
 * Colocated with the page because it is only ever this page's dialog; the page
 * stays readable and the form keeps its own markup.
 */
const TransactionForm = ({ data, methods }: ITransactionForm) => (
  <Dialog open={data.isFormOpen} onOpenChange={methods.setIsFormOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {data.editing ? 'Ubah Transaksi' : 'Catat Transaksi'}
        </DialogTitle>
        <DialogDescription>
          Kategori menentukan apakah saldo bertambah, berkurang, atau
          dipindahkan.
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
          <Label htmlFor='trx-category'>Kategori</Label>
          <Select
            value={data.form.categoryId}
            onValueChange={(value) => methods.setField('categoryId', value)}
          >
            <SelectTrigger id='trx-category'>
              <SelectValue placeholder='Pilih kategori' />
            </SelectTrigger>
            <SelectContent>
              {TYPE_ORDER.map((type) => {
                const options = data.categories.filter(
                  (category) => category.type === type,
                );
                if (!options.length) return null;
                return (
                  <div key={type}>
                    <SelectLabel>{CATEGORY_TYPE_LABELS[type]}</SelectLabel>
                    {options.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </div>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='trx-account'>
              {data.isTransfer ? 'Dari akun' : 'Akun'}
            </Label>
            <Select
              value={data.form.accountId}
              onValueChange={(value) => methods.setField('accountId', value)}
            >
              <SelectTrigger id='trx-account'>
                <SelectValue placeholder='Pilih akun' />
              </SelectTrigger>
              <SelectContent>
                {data.accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Only a transfer has a destination; the API rejects it otherwise. */}
          {data.isTransfer && (
            <div className='space-y-2'>
              <Label htmlFor='trx-to-account'>Ke akun</Label>
              <Select
                value={data.form.toAccountId}
                onValueChange={(value) =>
                  methods.setField('toAccountId', value)
                }
              >
                <SelectTrigger id='trx-to-account'>
                  <SelectValue placeholder='Pilih akun tujuan' />
                </SelectTrigger>
                <SelectContent>
                  {data.accounts
                    .filter((account) => account.id !== data.form.accountId)
                    .map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='trx-amount'>Jumlah</Label>
            <Input
              id='trx-amount'
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

          <div className='space-y-2'>
            <Label htmlFor='trx-date'>Tanggal</Label>
            <Input
              id='trx-date'
              type='date'
              value={data.form.transactionDate}
              onChange={(event) =>
                methods.setField('transactionDate', event.target.value)
              }
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='trx-description'>Deskripsi</Label>
          <Textarea
            id='trx-description'
            value={data.form.description}
            onChange={(event) =>
              methods.setField('description', event.target.value)
            }
            placeholder='Opsional, misalnya nama toko atau catatan'
            maxLength={500}
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
);

export default TransactionForm;
