'use client';

import { usePathname } from 'next/navigation';
import { MainHeader } from "@/components/layout/main-header"
import { MainFooter } from "@/components/layout/main-footer"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isVenueOwner = pathname?.startsWith('/venue-owner');

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header - Only show on non-admin and non-venue-owner routes */}
      {!isAdmin && !isVenueOwner && <MainHeader />}

      {/* Main Content */}
      <main className={`flex-1 relative z-10 ${isAdmin ? 'pt-0' : ''}`}>
        {children}
      </main>

      {/* Footer - Only show on non-admin and non-venue-owner routes */}
      {!isAdmin && !isVenueOwner && <MainFooter />}
      <Toaster />
    </div>
  );
}
