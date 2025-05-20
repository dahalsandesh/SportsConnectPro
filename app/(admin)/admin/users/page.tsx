import { Suspense } from "react"
import type { Metadata } from "next"
import UsersClient from "@/components/admin/users/users-client"
import { UsersTableSkeleton } from "@/components/admin/users/users-table-skeleton"

export const metadata: Metadata = {
  title: "User Management | Admin",
  description: "Manage users of the sports booking platform",
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage users of the platform</p>
      </div>

      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersClient />
      </Suspense>
    </div>
  )
}
