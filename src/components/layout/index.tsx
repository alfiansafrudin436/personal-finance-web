'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '@/components/sidebar';

interface ILayout {
  children?: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  return (
    <SidebarProvider>
      <div className='flex h-screen w-full'>
        <Sidebar />
        <SidebarInset>
          <main className='flex-1 overflow-auto p-4'>{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
