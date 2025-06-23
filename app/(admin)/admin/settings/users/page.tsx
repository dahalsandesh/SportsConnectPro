"use client";

import { Suspense } from "react";
import UsersClient from "@/components/admin/users/users-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage users of the platform
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
        <UsersClient />
      </Suspense>
    </div>
  );
}
