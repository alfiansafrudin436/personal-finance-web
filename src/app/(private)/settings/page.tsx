'use client';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import { useHooks } from './hooks';

const SettingsPage = () => {
  const { data, methods } = useHooks();

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Pengaturan'
        description='Kelola profil dan sesi kamu.'
      />

      <Card className='max-w-xl'>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>
            Email dipakai untuk masuk dan tidak bisa diubah di sini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.isLoading ? (
            <div className='space-y-4'>
              <Skeleton className='h-9' />
              <Skeleton className='h-9' />
            </div>
          ) : (
            <form
              className='space-y-4'
              onSubmit={(event) => {
                event.preventDefault();
                void methods.save();
              }}
            >
              <div className='space-y-2'>
                <Label htmlFor='profile-name'>Nama</Label>
                <Input
                  id='profile-name'
                  value={data.name}
                  onChange={(event) => methods.setName(event.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='profile-email'>Email</Label>
                <Input
                  id='profile-email'
                  value={data.email}
                  readOnly
                  disabled
                />
              </div>

              {data.error && (
                <p role='alert' className='text-sm text-destructive'>
                  {data.error}
                </p>
              )}
              {data.successMessage && (
                <p role='status' className='text-sm text-success'>
                  {data.successMessage}
                </p>
              )}

              <Button type='submit' disabled={data.isSaving}>
                {data.isSaving ? 'Menyimpan...' : 'Simpan perubahan'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className='max-w-xl'>
        <CardHeader>
          <CardTitle>Sesi</CardTitle>
          <CardDescription>
            Keluar akan menghapus token dari perangkat ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant='outline' onClick={methods.signOut}>
            Keluar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
