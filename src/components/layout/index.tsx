'use client';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Sidebar from '@/components/sidebar';

import { useHooks } from './hooks';

interface ILayout {
  children?: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  const { data } = useHooks();

  // Rendering the shell before the token check resolves would flash
  // signed-in chrome at a visitor who is about to be redirected.
  if (data.isChecking) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary' />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <header className='sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur'>
          <SidebarTrigger />
        </header>
        <main className='flex-1 overflow-x-hidden p-4 md:p-6'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
