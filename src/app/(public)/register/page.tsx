'use client';

import Link from 'next/link';

import { FormInput } from '@/components/form';
import { Button } from '@/components/ui/button';

import { useHooks } from './hooks';

const RegisterPage = () => {
  const { data, methods } = useHooks();

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10'>
      <div className='w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>Daftar</h1>
          <p className='text-sm text-muted-foreground'>
            Buat akun untuk mulai mencatat keuanganmu.
          </p>
        </div>

        {data.errors.root && (
          <div
            role='alert'
            className='rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'
          >
            {data.errors.root.message}
          </div>
        )}

        <form onSubmit={methods.onSubmit} className='space-y-4' noValidate>
          <FormInput
            id='name'
            label='Nama'
            placeholder='Nama lengkap'
            autoComplete='name'
            {...data.form.register('name')}
            error={data.errors.name?.message}
          />

          <FormInput
            id='email'
            type='email'
            label='Email'
            placeholder='kamu@contoh.com'
            autoComplete='email'
            {...data.form.register('email')}
            error={data.errors.email?.message}
          />

          <FormInput
            id='password'
            type='password'
            label='Password'
            placeholder='Minimal 8 karakter'
            autoComplete='new-password'
            {...data.form.register('password')}
            error={data.errors.password?.message}
          />

          <FormInput
            id='confirmPassword'
            type='password'
            label='Konfirmasi password'
            placeholder='Ulangi password'
            autoComplete='new-password'
            {...data.form.register('confirmPassword')}
            error={data.errors.confirmPassword?.message}
          />

          <Button type='submit' className='w-full' disabled={data.isLoading}>
            {data.isLoading ? 'Memproses...' : 'Daftar'}
          </Button>
        </form>

        <p className='text-center text-sm text-muted-foreground'>
          Sudah punya akun?{' '}
          <Link
            href='/login'
            className='font-medium text-primary hover:underline'
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
