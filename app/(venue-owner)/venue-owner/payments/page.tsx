import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentManagement from "./PaymentManagement";

export default function PaymentsPage() {
  return (
    <Suspense fallback={<PaymentsSkeleton />}>
      <PaymentManagement />
    </Suspense>
  );
}

function PaymentsSkeleton() {
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