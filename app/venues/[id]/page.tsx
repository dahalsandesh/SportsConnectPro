import { Suspense } from 'react';
import VenueDetailsClient from "@/components/venue-details-client";
import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton component
function VenueDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8">
        {/* Image gallery skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
        
        {/* Title and basic info skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          
          {/* Tabs skeleton */}
          <div className="flex space-x-4 pt-4">
            {['Overview', 'Facilities', 'Reviews', 'Location'].map((tab) => (
              <Skeleton key={tab} className="h-10 w-24" />
            ))}
          </div>
          
          {/* Tab content skeleton */}
          <div className="pt-4 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<VenueDetailsSkeleton />}>
      <VenueDetailsClient venueId={params.id} />
    </Suspense>
  );
}