"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import { UserType } from '@/types/auth';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

const publicPaths = ['/login', '/register'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, loading: isLoading } = useAppSelector((state) => state.auth as any);
  const router = useRouter();
  const pathname = usePathname();

  // Handle authentication state and redirects
  useEffect(() => {
    setMounted(true);
    
    // Only run redirect logic if we're not on a public path
    if (!publicPaths.includes(pathname)) {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      } else if (!isLoading && isAuthenticated && ((user as any)?.userType === UserType.VenueUsers || (user as any)?.userType === UserType.VenueOwner)) {
        router.push('/venue-owner');
      } else if (!isLoading && isAuthenticated && (user as any)?.userType !== UserType.NormalUsers) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, router, pathname]);

  // Show loading state while checking auth
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we're on a public path, just render the children
  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  // If not authenticated or wrong user type, show nothing (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }
  // Only allow NormalUsers to view dashboard content
  if ((user as any)?.userType !== UserType.NormalUsers) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
