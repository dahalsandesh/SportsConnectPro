"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CreditCard,
  ArrowUpRight,
  MapPin,
  Users,
  Activity,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetVenuesQuery } from "@/redux/api/venues/venuesApi";
import { useAppSelector } from "@/redux/store/hooks";
import { useGetCourtsQuery } from "@/redux/api/venueManagementApi";
import SlotManagement from "./SlotManagement";
import React from "react";
import VenueNewsMedia from "./VenueNewsMedia";
import VenueApplication from "./components/VenueApplication";
import CourtManagement from "./components/CourtManagement";
import VenueImageManagement from "./components/VenueImageManagement";
import SportsEventManagement from "./components/SportsEventManagement";
import { useGetVenueDashboardDataQuery } from "@/redux/api/venueManagementApi";
import { useGetBookingsQuery } from "@/redux/api/bookings/bookingsApi";
import { useGetPaymentsQuery } from "@/redux/api/payments/paymentsApi";
import { BookingChart } from "@/components/admin/dashboard/booking-chart";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { subMonths, startOfMonth, format } from "date-fns";

export default function VenueOwnerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: venuesResponse, isLoading, isError } = useGetVenuesQuery({});
  const venues = Array.isArray(venuesResponse?.data) ? venuesResponse.data : [];
  const ownerVenues = venues.filter(
    (venue) => venue.ownerEmail === user?.email
  ) || [];
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = useGetVenueDashboardDataQuery();

  // Fetch all bookings (could be paginated, but for charting we try to fetch all)
  const {
    data: bookingsData,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
  } = useGetBookingsQuery({ limit: 1000 });
  // Fetch all payments (if revenue is based on payments)
  const {
    data: paymentsData,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useGetPaymentsQuery({});

  // Filter bookings for owner venues
  const ownerVenueIds = ownerVenues.map((v) => v.venueId);
  const ownerBookings = (bookingsData?.data || []).filter(
    (b) => b.court && ownerVenueIds.includes(b.court.venueId)
  );

  // Aggregate bookings by month for last 6 months
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(startOfMonth(now), i);
    months.push(format(d, "yyyy-MM"));
  }
  const bookingsByMonth = months.map((month) => {
    const count = ownerBookings.filter((b) =>
      b.bookingDate.startsWith(month)
    ).length;
    return { date: month + "-01", bookings: count };
  });

  // Filter payments for owner venues (if payment has venue/court info)
  let ownerPayments = (paymentsData || []).filter((p: any) => {
    // Try to match payment.venueId or payment.court.venueId
    if (p.venueId && ownerVenueIds.includes(p.venueId)) return true;
    if (p.court && ownerVenueIds.includes(p.court.venueId)) return true;
    return false;
  });
  // Aggregate revenue by month for last 6 months
  const revenueByMonth = months.map((month) => {
    const revenue = ownerPayments
      .filter((p: any) => p.createdAt && p.createdAt.startsWith(month))
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    // Target is a placeholder, could be improved
    return { date: month + "-01", revenue, target: revenue * 1.1 };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Venue Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your venues and bookings
          </p>
        </div>
        <Button asChild>
          <Link href="/venue-owner/venues/new">Add New Venue</Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="courts">Courts</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Dashboard Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : isDashboardError ? (
                  <div className="text-red-500">Error</div>
                ) : (
                  <div className="text-2xl font-bold">
                    {dashboardData?.totalBookings ?? 0}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : isDashboardError ? (
                  <div className="text-red-500">Error</div>
                ) : (
                  <div className="text-2xl font-bold">
                    Rs.{dashboardData?.totalRevenue?.toLocaleString() ?? 0}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Courts
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : isDashboardError ? (
                  <div className="text-red-500">Error</div>
                ) : (
                  <div className="text-2xl font-bold">
                    {dashboardData?.activeCourts ?? 0}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Bookings
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : isDashboardError ? (
                  <div className="text-red-500">Error</div>
                ) : (
                  <div className="text-2xl font-bold">
                    {dashboardData?.pendingBookings ?? 0}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              {isBookingsLoading ? (
                <Card className="h-[300px] flex items-center justify-center">
                  <div>Loading bookings chart...</div>
                </Card>
              ) : isBookingsError ? (
                <Card className="h-[300px] flex items-center justify-center text-destructive">
                  <div>Error loading bookings chart</div>
                </Card>
              ) : (
                <BookingChart data={bookingsByMonth} />
              )}
            </div>
            <div className="col-span-3">
              {isPaymentsLoading ? (
                <Card className="h-[300px] flex items-center justify-center">
                  <div>Loading revenue chart...</div>
                </Card>
              ) : isPaymentsError ? (
                <Card className="h-[300px] flex items-center justify-center text-destructive">
                  <div>Error loading revenue chart</div>
                </Card>
              ) : (
                <RevenueChart data={revenueByMonth} />
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest venue activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ownerBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New booking created</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(booking.createdAt), "PPp")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venues" className="space-y-4">
          {isLoading && <p>Loading venues...</p>}
          {isError && <p className="text-red-500">Failed to load venues.</p>}
          {!isLoading && !isError && ownerVenues.length === 0 && (
            <p>No venues found.</p>
          )}
          {!isLoading && !isError && ownerVenues.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ownerVenues.map((venue) => (
                <VenueCardWithCourts key={venue.venueId} venue={venue} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="courts">
          <CourtManagement />
        </TabsContent>

        <TabsContent value="events">
          <SportsEventManagement />
        </TabsContent>

        <TabsContent value="media">
          <VenueNewsMedia />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Child component for venue card with courts
function VenueCardWithCourts({ venue }: { venue: any }) {
  const {
    data: courts = [],
    isLoading: isCourtsLoading,
    isError: isCourtsError,
  } = useGetCourtsQuery({ venueId: venue.venueId });
  const [openSlotCourtId, setOpenSlotCourtId] = React.useState<string | null>(
    null
  );

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader>
        <CardTitle>{venue.name}</CardTitle>
        <CardDescription>{venue.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2">
          City: {venue.cityName}
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          Phone: {venue.phoneNumber}
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          Email: {venue.email}
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          Created: {new Date(venue.createdAt).toLocaleDateString()}
        </div>

        <div className="mt-4">
          <div className="font-semibold mb-2">Courts:</div>
          {isCourtsLoading && (
            <div className="text-sm text-muted-foreground">
              Loading courts...
            </div>
          )}
          {isCourtsError && (
            <div className="text-sm text-red-500">Failed to load courts.</div>
          )}
          {!isCourtsLoading && !isCourtsError && courts.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No courts found for this venue.
            </div>
          )}
          {!isCourtsLoading && !isCourtsError && courts.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {courts.map((court: any) => (
                <li key={court.courtId} className="text-sm mb-2">
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="font-medium">{court.courtName}</span> —{" "}
                      {court.surfaceType}, Rs.{court.hourlyRate}/hr,{" "}
                      {court.capacity} players
                    </span>
                    <button
                      className="ml-2 text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
                      onClick={() =>
                        setOpenSlotCourtId(
                          openSlotCourtId === court.courtId
                            ? null
                            : court.courtId
                        )
                      }
                      type="button">
                      {openSlotCourtId === court.courtId
                        ? "Hide Slots"
                        : "Manage Slots"}
                    </button>
                  </div>
                  {openSlotCourtId === court.courtId && (
                    <SlotManagement
                      courtId={court.courtId}
                      date={new Date().toISOString().slice(0, 10)}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
