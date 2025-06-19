"use client"

import { useGetVenueDashboardDataQuery } from "@/redux/api/venue-owner/venueApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calendar, DollarSign, MapPin, Clock } from "lucide-react"
import { VenueDetailsCard } from "./venue-details-card"
import { CourtsManagement } from "./courts-management"
import { VenuePostsManagement } from "./venue-posts-management"

export function VenueDashboard() {
  const { data: dashboardData, isLoading, isError } = useGetVenueDashboardDataQuery()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">Error loading dashboard data. Please try again.</p>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Bookings",
      value: dashboardData?.totalBookings || 0,
      icon: Calendar,
      description: "Total bookings received",
      color: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `Rs.${dashboardData?.totalRevenue || 0}`,
      icon: DollarSign,
      description: "Revenue generated",
      color: "text-green-600",
    },
    {
      title: "Active Courts",
      value: dashboardData?.activeCourts || 0,
      icon: MapPin,
      description: "Courts available for booking",
      color: "text-purple-600",
    },
    {
      title: "Pending Bookings",
      value: dashboardData?.pendingBookings || 0,
      icon: Clock,
      description: "Bookings awaiting confirmation",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Venue Details */}
      <VenueDetailsCard />

      {/* Courts Management */}
      <CourtsManagement />

      {/* Posts Management */}
      <VenuePostsManagement />
    </div>
  )
}
