"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CreditCard, ArrowUpRight, Users, Trophy, Plus, FileText, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useGetVenuesQuery, useGetVenueDashboardDataQuery } from "@/redux/api/venue-owner/venueApi"
import { useAppSelector } from "@/redux/store/hooks"
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi"
import type { VenueDetails } from "@/types/api"
import SlotManagement from "./SlotManagement"
import React from "react"
import VenueNewsMedia from "./VenueNewsMedia"
import CourtManagement from "./components/CourtManagement"
import ReelsManagement from "./components/ReelsManagement"
import { BookingChart } from "@/components/admin/dashboard/booking-chart"
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart"
import { subMonths, startOfMonth, format } from "date-fns"
import type { Booking, Payment } from "@/types/api"

export default function VenueOwnerDashboard() {
  const { user } = useAppSelector((state) => state.auth)
  // Get the current user's ID from your auth state or context
  // Type assertion for now - should update the User type in auth slice to include id
  const currentUserId = (user as unknown as { id?: string })?.id || ""

  const {
    data: venuesResponse,
    isLoading,
    isError,
  } = useGetVenuesQuery(
    { userId: currentUserId },
    { skip: !currentUserId }, // Skip query if no user ID is available
  )

  // Extract venues from the response
  const venues = Array.isArray(venuesResponse) ? venuesResponse : []
  const ownerVenues = venues.filter((venue: VenueDetails) => venue.ownerEmail === user?.email) || []

  // Get the first venue ID for components that need it
  const firstVenueId = ownerVenues[0]?.venueId || ""

  // Get dashboard data
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = useGetVenueDashboardDataQuery()

  // Prepare data for charts
  const months: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(startOfMonth(now), i)
    months.push(format(d, "yyyy-MM"))
  }

  // Mock data for charts since dashboardData doesn't have trends
  const bookingsByMonth = months.map((month) => ({
    date: `${month}-01`,
    bookings: Math.floor(Math.random() * 50) + 10, // Random data for demo
  }))

  const revenueByMonth = months.map((month) => ({
    date: `${month}-01`,
    revenue: Math.floor(Math.random() * 10000) + 1000, // Random data for demo
    target: Math.floor(Math.random() * 12000) + 1200, // Random target
  }))

  // Get data from dashboard response
  const totalBookings = dashboardData?.totalBookings || 0
  const totalRevenue = dashboardData?.totalRevenue || 0
  const activeVenues = ownerVenues.length // Use the actual count of owner's venues
  const pendingBookings = 0 // Not available in VenueDashboardData

  // Mock recent data since not in VenueDashboardData
  const recentBookings: Booking[] = []
  const recentPayments: Payment[] = []

  const { data: courts = [], isLoading: isCourtsLoading, isError: isCourtsError } = useGetCourtsQuery()

  const quickActions = [
    {
      title: "Create Post",
      description: "Share updates and news with your audience",
      icon: <FileText className="h-8 w-8" />,
      href: "/venue-owner/media?tab=post",
      color: "text-blue-600",
    },
    {
      title: "Create Reel",
      description: "Upload engaging video content",
      icon: <Video className="h-8 w-8" />,
      href: "/venue-owner/media?tab=reel",
      color: "text-purple-600",
    },
    {
      title: "Create Event",
      description: "Organize sports events and tournaments",
      icon: <Trophy className="h-8 w-8" />,
      href: "/venue-owner/events",
      color: "text-green-600",
    },
    {
      title: "Manage Bookings",
      description: "View and manage court bookings",
      icon: <Calendar className="h-8 w-8" />,
      href: "/venue-owner/bookings",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Venue Dashboard</h1>
          <p className="text-muted-foreground">Manage your venues and bookings</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/venue-owner/venues/new">
            <Plus className="mr-2 h-4 w-4" /> Add Venue
          </Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href={action.href}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
                <div className={action.color}>{action.icon}</div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold">Set up your venue</h3>
              <p className="text-sm text-muted-foreground">
                Complete your venue profile and add courts to start receiving bookings.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/venue-owner/venues">Manage Venues</Link>
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Create content</h3>
              <p className="text-sm text-muted-foreground">
                Share posts, reels, and organize events to engage with your community.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/venue-owner/media">Create Content</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* <TabsTrigger value="venues">Venues</TabsTrigger> */}
          <TabsTrigger value="courts">Courts</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="reels">Reels</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Dashboard Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : isDashboardError ? (
                  <div className="text-red-500">Error</div>
                ) : (
                  <div className="text-2xl font-bold">{dashboardData?.totalBookings ?? 0}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : isDashboardError ? (
                  <div className="text-red-500">Error</div>
                ) : (
                  <div className="text-2xl font-bold">Rs.{dashboardData?.totalRevenue?.toLocaleString() ?? 0}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : isDashboardError ? (
                  <div className="text-red-500">Error</div>
                ) : (
                  <div className="text-2xl font-bold">{dashboardData?.activeCourts ?? 0}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : isDashboardError ? (
                  <div className="text-red-500">Error</div>
                ) : (
                  <div className="text-2xl font-bold">{pendingBookings}</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              {isDashboardLoading ? (
                <Card className="h-[300px] flex items-center justify-center">
                  <div>Loading bookings chart...</div>
                </Card>
              ) : isDashboardError ? (
                <Card className="h-[300px] flex items-center justify-center text-destructive">
                  <div>Error loading bookings chart</div>
                </Card>
              ) : (
                <BookingChart data={bookingsByMonth} />
              )}
            </div>
            <div className="col-span-3">
              {isDashboardLoading ? (
                <Card className="h-[300px] flex items-center justify-center">
                  <div>Loading revenue chart...</div>
                </Card>
              ) : isDashboardError ? (
                <Card className="h-[300px] flex items-center justify-center text-destructive">
                  <div>Error loading revenue chart</div>
                </Card>
              ) : (
                <RevenueChart data={revenueByMonth} />
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {booking.status === "PENDING" ? "New" : ""} Booking #{booking.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.bookingDate} • {booking.startTime}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent bookings found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="venues" className="space-y-4">
          {isLoading && <p>Loading venues...</p>}
          {isError && <p className="text-red-500">Failed to load venues.</p>}
          {!isLoading && !isError && ownerVenues.length === 0 && <p>No venues found.</p>}
          {!isLoading && !isError && ownerVenues.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ownerVenues.map((venue) => (
                <VenueCardWithCourts key={venue.venueId} venue={venue} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="courts">
          <CourtManagement venueId={firstVenueId} />
        </TabsContent>

        <TabsContent value="events">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Events</h2>
            <p className="text-muted-foreground">Select a court to manage events</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courts.map((court: any) => (
                <Card key={court.courtId} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{court.courtName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full text-white" asChild>
                      <Link href={`/venue-owner/events?courtId=${court.courtId}`}>Manage Events</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="media">
          <VenueNewsMedia />
        </TabsContent>

        <TabsContent value="reels">
          <ReelsManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Child component for venue card with courts
function VenueCardWithCourts({ venue }: { venue: VenueDetails }) {
  const { data: courts = [], isLoading: isCourtsLoading, isError: isCourtsError } = useGetCourtsQuery()
  const [openSlotCourtId, setOpenSlotCourtId] = React.useState<string | null>(null)

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader>
        <CardTitle>{venue.name}</CardTitle>
        <CardDescription>{venue.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2">City: {venue.cityName}</div>
        <div className="text-sm text-muted-foreground mb-2">Phone: {venue.phoneNumber}</div>
        <div className="text-sm text-muted-foreground mb-2">Email: {venue.email}</div>
        <div className="text-xs text-muted-foreground mb-2">
          Created: {new Date(venue.createdAt).toLocaleDateString()}
        </div>

        <div className="mt-4">
          <div className="font-semibold mb-2">Courts:</div>
          {isCourtsLoading && <div className="text-sm text-muted-foreground">Loading courts...</div>}
          {isCourtsError && <div className="text-sm text-red-500">Failed to load courts.</div>}
          {!isCourtsLoading && !isCourtsError && courts.length === 0 && (
            <div className="text-sm text-muted-foreground">No courts found for this venue.</div>
          )}
          {!isCourtsLoading && !isCourtsError && courts.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {courts.map((court: any) => (
                <li key={court.courtId} className="text-sm mb-2">
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="font-medium">{court.courtName}</span> — {court.surfaceType}, Rs.
                      {court.hourlyRate}/hr, {court.capacity} players
                    </span>
                    <button
                      className="ml-2 text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
                      onClick={() => setOpenSlotCourtId(openSlotCourtId === court.courtId ? null : court.courtId)}
                      type="button"
                    >
                      {openSlotCourtId === court.courtId ? "Hide Slots" : "Manage Slots"}
                    </button>
                  </div>
                  {openSlotCourtId === court.courtId && (
                    <SlotManagement courtId={court.courtId} date={new Date().toISOString().slice(0, 10)} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
