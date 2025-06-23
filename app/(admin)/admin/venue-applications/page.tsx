import { Suspense } from "react"
import type { Metadata } from "next"
import VenueApplicationsClient from "@/components/admin/venue-applications/venue-applications-client"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Venue Applications | Admin",
  description: "Manage venue applications of the sports booking platform",
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function VenueApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Venue Applications</h1>
        <p className="text-muted-foreground">Manage venue applications of the platform</p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <VenueApplicationsClient />
      </Suspense>
    </div>
  )
}
