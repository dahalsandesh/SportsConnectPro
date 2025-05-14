import type React from "react"
import type { Metadata } from "next"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { VenueOwnerHeader } from "@/components/venue-owner/header"
import { VenueOwnerSidebar } from "@/components/venue-owner/sidebar"
import { UserType } from "@/types/auth"

export const metadata: Metadata = {
  title: "Venue Owner Dashboard",
  description: "Manage your venues and bookings",
}

export default function VenueOwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole={UserType.VenueOwner}>
      <div className="flex min-h-screen flex-col">
        <VenueOwnerHeader />
        <div className="flex flex-1">
          <VenueOwnerSidebar />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
