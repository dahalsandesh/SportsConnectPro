"use client";

import { Suspense } from "react";
import { CityList } from "@/components/admin/city/city-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function CitiesSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cities Management</h1>
        <p className="text-muted-foreground">
          Manage cities available in the platform
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <CityList />
      </Suspense>
    </div>
  );
}
