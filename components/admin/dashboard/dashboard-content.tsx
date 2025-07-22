'use client'

import { BookingChart } from "@/components/admin/dashboard/booking-chart"
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart"
import { SportTypeChart } from "@/components/admin/dashboard/sport-type-chart"
import { useGetDashboardDataQuery } from "@/redux/api/admin/dashboardApi"
import { Skeleton } from "@/components/ui/skeleton"

function Charts({ postStats, reelStats }: { postStats: any[], reelStats: any[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <BookingChart data={postStats} />
      <RevenueChart reelStats={reelStats} />
      <SportTypeChart />
    </div>
  )
}

export function DashboardContent() {
  const { data, isLoading, isError } = useGetDashboardDataQuery()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="space-y-6">
          <DashboardStats />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading dashboard data</p>
      </div>
    )
  }

  // Ensure post_statics and reel_statics are properly formatted arrays
  const postStats = Array.isArray(data?.post_statics) 
    ? data.post_statics.map(item => ({
        category: String(item?.category || 'Unknown'),
        post_count: Number(item?.post_count) || 0
      }))
    : []

  const reelStats = Array.isArray(data?.reel_statics)
    ? data.reel_statics.map(item => ({
        category: String(item?.category || 'Unknown'),
        post_count: Number(item?.post_count) || 0
      }))
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="space-y-6">
        <DashboardStats />
        <Charts 
          postStats={postStats}
          reelStats={reelStats}
        />
      </div>
    </div>
  )
}
