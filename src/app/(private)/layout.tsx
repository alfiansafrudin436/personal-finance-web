import Layout from '@/components/layout';

/**
 * Route-group layout. The <html> and <body> tags belong to the root layout
 * in src/app/layout.tsx, so this only wraps the private pages in the shell.
 */
export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout>{children}</Layout>;
}
