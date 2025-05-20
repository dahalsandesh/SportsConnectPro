import { Suspense } from "react"
import type { Metadata } from "next"
import VenueApplicationDetailClient from "@/components/admin/venue-applications/venue-application-detail-client"
import { ApplicationDetailSkeleton } from "@/components/admin/venue-applications/application-detail-skeleton"

export const metadata: Metadata = {
  title: "Venue Application Details | Admin",
  description: "View and manage venue application details",
}

export default function VenueApplicationDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Venue Application Details</h1>
        <p className="text-muted-foreground">Review and manage venue application</p>
      </div>

      <Suspense fallback={<ApplicationDetailSkeleton />}>
        <VenueApplicationDetailClient id={params.id} />
      </Suspense>
    </div>
  )
}
