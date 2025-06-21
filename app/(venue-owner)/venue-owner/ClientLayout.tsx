"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import { UserType } from '@/types/auth';
import { VenueOwnerHeader } from '@/components/venue-owner/header';
import { VenueOwnerSidebar } from '@/components/venue-owner/sidebar';

const publicPaths = ['/login', '/register'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  // Handle authentication state and redirects
  useEffect(() => {
    setMounted(true);
    
    // Only run redirect logic if we're not on a public path
    if (!publicPaths.includes(pathname)) {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      } else if (!isLoading && isAuthenticated && user?.userType !== UserType.VenueUsers) {
        router.push('/unauthorized');
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
  if (!isAuthenticated || user?.userType !== UserType.VenueUsers) {
    return null;
  }

  // Render the authenticated layout
  return (
    <div className="flex min-h-screen flex-col">
      <VenueOwnerHeader />
      <div className="flex flex-1">
        <VenueOwnerSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
