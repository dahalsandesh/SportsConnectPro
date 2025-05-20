import { Suspense } from "react"
import type { Metadata } from "next"
import VenueApplicationsClient from "@/components/admin/venue-applications/venue-applications-client"
import { ApplicationsTableSkeleton } from "@/components/admin/venue-applications/applications-table-skeleton"

export const metadata: Metadata = {
  title: "Venue Applications | Admin",
  description: "Manage venue applications of the sports booking platform",
}

export default function VenueApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Venue Applications</h1>
        <p className="text-muted-foreground">Manage venue applications of the platform</p>
      </div>

      <Suspense fallback={<ApplicationsTableSkeleton />}>
        <VenueApplicationsClient />
      </Suspense>
    </div>
  )
}
