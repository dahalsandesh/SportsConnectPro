import { Suspense } from "react"
import type { Metadata } from "next"
import AdminDashboardClient from "@/components/admin/dashboard/client-page"
import { DashboardSkeleton } from "@/components/admin/dashboard/dashboard-skeleton"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your sports booking platform",
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboardClient />
    </Suspense>
  )
}
