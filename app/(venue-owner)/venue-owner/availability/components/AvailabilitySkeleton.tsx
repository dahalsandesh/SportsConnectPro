import { Loader2 } from "lucide-react";

export const AvailabilitySkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-64 mt-2 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="grid gap-4">
      <div className="h-[500px] w-full bg-gray-200 rounded animate-pulse flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    </div>
  </div>
);
