'use client';

import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';

import ConfirmDialog from '@/components/confirm-dialog';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
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
import { Skeleton } from '@/components/ui/skeleton';
import { CATEGORY_TYPE_LABELS, CATEGORY_TYPE_OPTIONS } from '@/lib/format';
import { cn } from '@/lib/utils';
import { CategoryType } from '@/types';

import { useHooks } from './hooks';

const FILTERS: Array<{ value: CategoryType | 'all'; label: string }> = [
  { value: 'all', label: 'Semua' },
  { value: 'income', label: 'Pemasukan' },
  { value: 'expense', label: 'Pengeluaran' },
  { value: 'transfer', label: 'Transfer' },
];

const CategoriesPage = () => {
  const { data, methods } = useHooks();

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Kategori'
        description='Kategori bawaan tersedia untuk semua pengguna dan tidak bisa diubah.'
        action={
          <Button onClick={methods.openCreate}>
            <IconPlus />
            Tambah kategori
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

      <div className='flex flex-wrap gap-2'>
        {FILTERS.map((filter) => (
          <Button
            key={filter.value}
            size='sm'
            variant={data.typeFilter === filter.value ? 'default' : 'outline'}
            onClick={() => methods.setTypeFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {data.isLoading ? (
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {[0, 1, 2, 3, 4, 5].map((key) => (
            <Skeleton key={key} className='h-20 rounded-xl' />
          ))}
        </div>
      ) : data.categories.length ? (
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {data.categories.map((category) => (
            <Card key={category.id}>
              <CardContent className='flex items-start justify-between gap-3 p-4'>
                <div className='flex min-w-0 items-start gap-3'>
                  <span
                    aria-hidden
                    className={cn(
                      'mt-0.5 h-8 w-8 shrink-0 rounded-lg',
                      !category.color && 'bg-muted',
                    )}
                    style={
                      category.color
                        ? { backgroundColor: category.color }
                        : undefined
                    }
                  />
                  <div className='min-w-0'>
                    <p className='truncate font-medium'>{category.name}</p>
                    <div className='mt-1 flex flex-wrap items-center gap-1.5'>
                      <Badge variant={category.type}>
                        {CATEGORY_TYPE_LABELS[category.type]}
                      </Badge>
                      {category.isGlobal && (
                        <Badge variant='secondary'>Bawaan</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {!category.isGlobal && (
                  <div className='flex shrink-0 items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      aria-label={`Ubah ${category.name}`}
                      onClick={() => methods.openEdit(category)}
                    >
                      <IconPencil />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      aria-label={`Hapus ${category.name}`}
                      onClick={() => methods.setDeleting(category)}
                    >
                      <IconTrash />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title='Tidak ada kategori'
          description='Belum ada kategori untuk filter ini.'
          action={<Button onClick={methods.openCreate}>Tambah kategori</Button>}
        />
      )}

      <Dialog open={data.isFormOpen} onOpenChange={methods.setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {data.editing ? 'Ubah Kategori' : 'Tambah Kategori'}
            </DialogTitle>
            <DialogDescription>
              Tipe kategori menentukan efek transaksi ke saldo akun.
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
              <Label htmlFor='category-name'>Nama kategori</Label>
              <Input
                id='category-name'
                value={data.form.name}
                onChange={(event) =>
                  methods.setField('name', event.target.value)
                }
                placeholder='Contoh: Makan, Transportasi'
                autoFocus
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category-type'>Tipe</Label>
              <Select
                value={data.form.type}
                onValueChange={(value) =>
                  methods.setField('type', value as CategoryType)
                }
              >
                <SelectTrigger id='category-type'>
                  <SelectValue placeholder='Pilih tipe' />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='category-icon'>Ikon</Label>
                <Input
                  id='category-icon'
                  value={data.form.icon}
                  onChange={(event) =>
                    methods.setField('icon', event.target.value)
                  }
                  placeholder='utensils'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category-color'>Warna</Label>
                <div className='flex items-center gap-2'>
                  <input
                    id='category-color'
                    type='color'
                    value={data.form.color || '#64748b'}
                    onChange={(event) =>
                      methods.setField('color', event.target.value)
                    }
                    className='h-9 w-12 shrink-0 cursor-pointer rounded-md border border-input bg-transparent'
                  />
                  <Input
                    value={data.form.color}
                    onChange={(event) =>
                      methods.setField('color', event.target.value)
                    }
                    placeholder='#64748b'
                    aria-label='Kode warna hex'
                  />
                </div>
              </div>
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
        title={`Hapus kategori ${data.deleting?.name ?? ''}?`}
        description='Kategori yang masih dipakai transaksi tidak bisa dihapus.'
        isLoading={data.isDeleting}
        onConfirm={methods.confirmDelete}
      />
    </div>
  );
};

export default CategoriesPage;
