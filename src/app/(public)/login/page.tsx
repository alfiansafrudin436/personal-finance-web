'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useLogin } from './hooks';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/form';
import { loginSchema } from '@/lib/schemas';
import { yupResolver } from '@hookform/resolvers/yup';

export default function LoginPage() {
  const { data, methods } = useLogin();

  const form = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const handleSubmit = async (data: any) => {
    await methods.login(data);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold text-gray-900'>Welcome Back</h1>
          <p className='text-gray-600'>
            Sign in to your Personal Finance account
          </p>
        </div>

        {/* Error Message */}
        {form.formState.errors.root && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Login Form */}
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

          {/* Password Field */}
          <FormInput
            id='password'
            type='password'
            label='Password'
            placeholder='Enter your password'
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />

          {/* Forgot Password Link */}
          <div className='flex justify-end'>
            <Link
              href='/forgot-password'
              className='text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200'
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={methods.isLoading}
          >
            {methods.isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>
              Or continue with
            </span>
          </div>
        </div>

        {/* Register Link */}
        <div className='text-center space-y-4'>
          <p className='text-sm text-gray-600'>
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200'
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
