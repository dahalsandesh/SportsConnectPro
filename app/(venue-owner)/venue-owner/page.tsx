import { Suspense } from "react"
import VenueOwnerDashboardClient from "./client-page"
import { Skeleton } from "@/components/ui/skeleton"

export default function VenueOwnerDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <VenueOwnerDashboardClient />
    </Suspense>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-96" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[350px] w-full col-span-4" />
          <Skeleton className="h-[350px] w-full col-span-3" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[350px] w-full col-span-4" />
          <Skeleton className="h-[350px] w-full col-span-3" />
        </div>
      </div>
    </div>
  )
}
