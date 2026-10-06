'use client';

import Link from 'next/link';

import { FormInput } from '@/components/form';
import { Button } from '@/components/ui/button';

import { useHooks } from './hooks';

const LoginPage = () => {
  const { data, methods } = useHooks();

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10'>
      <div className='w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>Masuk</h1>
          <p className='text-sm text-muted-foreground'>
            Kelola keuangan pribadimu dalam satu tempat.
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
            placeholder='Masukkan password'
            autoComplete='current-password'
            {...data.form.register('password')}
            error={data.errors.password?.message}
          />

          <div className='flex justify-end'>
            <Link
              href='/forgot-password'
              className='text-sm font-medium text-primary hover:underline'
            >
              Lupa password?
            </Link>
          </div>

          <Button type='submit' className='w-full' disabled={data.isLoading}>
            {data.isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <p className='text-center text-sm text-muted-foreground'>
          Belum punya akun?{' '}
          <Link
            href='/register'
            className='font-medium text-primary hover:underline'
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
