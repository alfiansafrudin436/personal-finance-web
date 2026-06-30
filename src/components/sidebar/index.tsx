'use client';

import {
  Sidebar as Sdb,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

const sidebarItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: '📊',
  },
  {
    title: 'Transactions',
    url: '/transactions',
    icon: '💳',
  },
  {
    title: 'Budget',
    url: '/budget',
    icon: '💰',
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: '📈',
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: '⚙️',
  },
];

 const Sidebar = () => {
  return (
    <Sdb>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-4 py-3'>
          <span className='text-xl font-bold text-primary'>Finance</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={false}>
                  <Link href={item.url}>
                    <span className='text-lg mr-2'>{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className='flex flex-col items-center gap-2 px-4 py-3 border-t'>
          <span className='text-sm text-muted-foreground'>
            Personal Finance App
          </span>
          <button className='text-xs text-muted-foreground hover:text-foreground'>
            Sign out
          </button>
        </div>
      </SidebarFooter>
    </Sdb>
  );
}

export default Sidebar;