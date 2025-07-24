'use client';

import { usePathname } from 'next/navigation';
import { MainHeader } from "@/components/layout/main-header"
import { MainFooter } from "@/components/layout/main-footer"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isVenueOwner = pathname?.startsWith('/venue-owner');
  const isDashboard = pathname?.startsWith('/dashboard');

  const showPublicLayout = !isAdmin && !isVenueOwner && !isDashboard;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Header - Only show on public routes */}
      {showPublicLayout && <MainHeader />}

      {/* Main Content - Prevent horizontal overflow */}
      <main className={`flex-1 relative z-10 w-full ${!showPublicLayout ? 'pt-0' : ''}`}>
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Footer - Only show on public routes */}
      {showPublicLayout && <MainFooter />}
      <Toaster />
    </div>
  );
}
