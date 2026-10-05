'use client';

import Link from 'next/link';
import { IconLogout } from '@tabler/icons-react';

import {
  Sidebar as Sdb,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useHooks } from './hooks';

const Sidebar = () => {
  const { data, methods } = useHooks();

  return (
    <Sdb>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-2 py-3'>
          <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground'>
            Rp
          </span>
          <span className='text-base font-semibold'>Personal Finance</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarMenu>
            {data.items.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={data.isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className='flex flex-col gap-2 border-t border-sidebar-border px-2 py-3'>
          {data.user && (
            <div className='min-w-0'>
              <p className='truncate text-sm font-medium'>{data.user.name}</p>
              <p className='truncate text-xs text-muted-foreground'>
                {data.user.email}
              </p>
            </div>
          )}
          <button
            type='button'
            onClick={methods.handleSignOut}
            className='flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          >
            <IconLogout className='h-4 w-4' />
            Keluar
          </button>
        </div>
      </SidebarFooter>
    </Sdb>
  );
};

export default Sidebar;
