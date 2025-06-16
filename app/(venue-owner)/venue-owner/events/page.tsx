import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EventManagement from "./EventManagement";

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsSkeleton />}>
      <EventManagement />
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
