import { BookingChart } from "@/components/admin/dashboard/booking-chart"
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart"
import { SportTypeChart } from "@/components/admin/dashboard/sport-type-chart"
import { CityList } from "@/components/admin/settings/city-list"
import { PostsManagement } from "@/components/admin/posts/posts-management"
import { ApplicationsManagement } from "@/components/admin/venue-applications/applications-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts & News</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Existing dashboard stats and charts */}
          <DashboardStats />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BookingChart />
            <RevenueChart />
            <SportTypeChart />
          </div>
        </TabsContent>

        <TabsContent value="posts">
          <PostsManagement />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsManagement />
        </TabsContent>

        <TabsContent value="settings">
          {/* Existing settings components like CityList, etc. */}
          <div className="grid gap-6">
            <CityList />
            {/* Add other configuration components */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
