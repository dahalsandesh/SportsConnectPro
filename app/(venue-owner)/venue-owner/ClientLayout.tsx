"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserType } from "@/types/auth"
import { VenueOwnerSidebar } from "@/components/venue-owner/sidebar"
import { VenueOwnerHeader } from "@/components/venue-owner/header"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={UserType.VenueUsers}>
      <div className="flex h-screen bg-gray-100">
        <VenueOwnerSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <VenueOwnerHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
