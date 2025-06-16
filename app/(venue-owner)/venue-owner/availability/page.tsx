import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AvailabilityManagement from "./AvailabilityManagement";

export default function AvailabilityPage() {
  return (
    <Suspense fallback={<AvailabilitySkeleton />}>
      <AvailabilityManagement />
    </Suspense>
  );
}

function AvailabilitySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4">
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  );
}
