"use client"

import type React from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { VenueOwnerHeader } from "@/components/venue-owner/header"
import { VenueOwnerSidebar, VenueOwnerSidebarContent } from "@/components/venue-owner/sidebar"
import { UserType } from "@/types/auth"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ProtectedRoute requiredRole={UserType.VenueOwner}>
      <div className="flex min-h-screen flex-col">
        <VenueOwnerHeader />
        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <VenueOwnerSidebar />

          {/* Mobile Sidebar */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-auto py-4">
                <VenueOwnerSidebarContent />
              </div>
            </SheetContent>
          </Sheet>

          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
