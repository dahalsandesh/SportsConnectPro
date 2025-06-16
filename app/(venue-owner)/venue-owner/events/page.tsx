import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SportsEventManagement from "../components/SportsEventManagement";

export default function EventsPage() {
  // You might want to get the venueId from a parent component or context
  // For now, using a placeholder or you can modify as per your app's requirements
  const venueId = "";
  
  if (!venueId) {
    return (
      <div className="p-4">
        <p>Please select a venue to manage events.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<EventsSkeleton />}>
      <SportsEventManagement venueId={venueId} />
    </Suspense>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
