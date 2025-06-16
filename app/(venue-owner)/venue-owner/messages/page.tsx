import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MessageManagement from "./MessageManagement";

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesSkeleton />}>
      <MessageManagement />
    </Suspense>
  );
}

function MessagesSkeleton() {
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
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  );
} 