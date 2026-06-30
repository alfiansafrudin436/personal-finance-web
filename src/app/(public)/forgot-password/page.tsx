'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useForgotPassword } from './hooks';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/form';
import { forgotPasswordSchema } from '@/lib/schemas';
import { yupResolver } from '@hookform/resolvers/yup';

export default function ForgotPasswordPage() {
  const { data, methods } = useForgotPassword();

  const form = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const handleSubmit = async (data: any) => {
    await methods.sendResetEmail(data);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold text-gray-900'>Forgot Password</h1>
          <p className='text-gray-600'>
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </p>
        </div>

        {/* Error Message */}
        {form.formState.errors.root && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-5'>
          {/* Email Field */}
          <FormInput
            id='email'
            type='email'
            label='Email Address'
            placeholder='you@example.com'
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />

          {/* Submit Button */}
          <Button
            type='submit'
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={methods.isLoading}
          >
            {methods.isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className='text-center'>
          <Link
            href='/login'
            className='text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200'
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
