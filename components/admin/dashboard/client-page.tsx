import { BookingChart } from "@/components/admin/dashboard/booking-chart"
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart"
import { SportTypeChart } from "@/components/admin/dashboard/sport-type-chart"

export default function ClientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="space-y-6">
        <DashboardStats />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <BookingChart />
          <RevenueChart />
          <SportTypeChart />
        </div>
      </div>
    </div>
  )
}
