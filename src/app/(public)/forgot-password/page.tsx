'use client';

import Link from 'next/link';

import { FormInput } from '@/components/form';
import { Button } from '@/components/ui/button';

import { useHooks } from './hooks';

const ForgotPasswordPage = () => {
  const { data, methods } = useHooks();

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10'>
      <div className='w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Lupa Password
          </h1>
          <p className='text-sm text-muted-foreground'>
            Masukkan email kamu dan kami kirimkan tautan untuk mengatur ulang
            password.
          </p>
        </div>

        {data.isSent ? (
          <div
            role='status'
            className='space-y-4 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success'
          >
            <p>
              Jika email tersebut terdaftar, tautan pengaturan ulang sudah kami
              kirim. Cek juga folder spam.
            </p>
          </div>
        ) : (
          <>
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

              <Button
                type='submit'
                className='w-full'
                disabled={data.isLoading}
              >
                {data.isLoading ? 'Mengirim...' : 'Kirim tautan'}
              </Button>
            </form>
          </>
        )}

        <p className='text-center text-sm text-muted-foreground'>
          <Link
            href='/login'
            className='font-medium text-primary hover:underline'
          >
            Kembali ke halaman masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
