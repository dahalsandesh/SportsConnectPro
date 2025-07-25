'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import './nprogress.css'; // Custom NProgress styles
import { MainHeader } from "@/components/layout/main-header"
import { MainFooter } from "@/components/layout/main-footer"
import { Toaster } from "@/components/ui/toaster"

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  minimum: 0.1
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith('/admin');
  const isVenueOwner = pathname?.startsWith('/venue-owner');
  const isDashboard = pathname?.startsWith('/dashboard');
  const showPublicLayout = !isAdmin && !isVenueOwner && !isDashboard;

  // Handle route change events for NProgress
  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    router.events?.on('routeChangeStart', handleStart);
    router.events?.on('routeChangeComplete', handleStop);
    router.events?.on('routeChangeError', handleStop);

    return () => {
      router.events?.off('routeChangeStart', handleStart);
      router.events?.off('routeChangeComplete', handleStop);
      router.events?.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header - Only show on public routes */}
      {showPublicLayout && <MainHeader />}

      {/* Main Content */}
      <main className={`flex-1 relative z-10 ${!showPublicLayout ? 'pt-0' : ''}`}>
        {children}
      </main>

      {/* Footer - Only show on public routes */}
      {showPublicLayout && <MainFooter />}
      <Toaster />
    </div>
  );
}
