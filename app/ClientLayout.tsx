'use client';

import { usePathname } from 'next/navigation';
import { MainHeader } from "@/components/layout/main-header"
import { MainFooter } from "@/components/layout/main-footer"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header - Only show on non-admin routes */}
      {!isAdmin && <MainHeader />}

      {/* Main Content */}
      <main className={`flex-1 relative z-10 ${isAdmin ? 'pt-0' : ''}`}>
        {children}
      </main>

      {/* Footer - Only show on non-admin routes */}
      {!isAdmin && <MainFooter />}
      <Toaster />
    </div>
  );
}
