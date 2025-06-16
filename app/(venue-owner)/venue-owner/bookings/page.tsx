import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BookingManagement from "./BookingManagement";

export default function BookingsPage() {
  return (
    <Suspense fallback={<BookingsSkeleton />}>
      <BookingManagement />
    </Suspense>
  );
}

function BookingsSkeleton() {
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
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}
