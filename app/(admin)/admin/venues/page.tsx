import { Suspense } from "react"
import type { Metadata } from "next"
import VenuesClient from "@/components/admin/venues/venues-client"
import { VenuesTableSkeleton } from "@/components/admin/venues/venues-table-skeleton"

export const metadata: Metadata = {
  title: "Venue Management | Admin",
  description: "Manage venues of the sports booking platform",
}

export default function VenuesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Venue Management</h1>
        <p className="text-muted-foreground">Manage venues of the sports booking platform</p>
      </div>

      <Suspense fallback={<VenuesTableSkeleton />}>
        <VenuesClient />
      </Suspense>
    </div>
  )
}
