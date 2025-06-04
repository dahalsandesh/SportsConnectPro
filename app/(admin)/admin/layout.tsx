"use client"

import { Inter, Poppins } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/redux/provider"
import { NotificationProvider } from "@/components/notification-provider"
import { cn } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminHeader } from "@/components/admin/header"
import { AdminSidebar } from "@/components/admin/sidebar"
import { UserType } from "@/types/auth"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

// Font loading with optimized settings
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
})

// Define props type for better TypeScript support
interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Set mounted state after component mounts on client
  useEffect(() => {
    setMounted(true)
    
    // Cleanup function
    return () => {
      setMounted(false)
    }
  }, [])

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
    )
  }

  // Main layout
  return (
    <div className={cn(
      "min-h-screen bg-background font-sans antialiased flex flex-col",
      inter.variable,
      poppins.variable
    )}>
      <ReduxProvider>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <NotificationProvider>
            <ProtectedRoute requiredRole={UserType.Admin}>
              <div className="flex min-h-screen flex-col">
                <AdminHeader />
                <div className="flex flex-1">
                  <AdminSidebar />
                  <main 
                    className="flex-1 p-4 md:p-6 overflow-auto"
                    role="main"
                  >
                    {children}
                  </main>
                </div>
              </div>
              <Toaster />
            </ProtectedRoute>
          </NotificationProvider>
        </ThemeProvider>
      </ReduxProvider>
    </div>
  )
}
