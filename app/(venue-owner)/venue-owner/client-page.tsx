"use client";
import React from "react";
declare const SlotManagement: any;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  CreditCard,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { useGetVenuesQuery, useGetVenueDashboardDataQuery } from "@/redux/api/venue-owner/venueApi";
import { useGetNotificationsQuery } from "@/redux/api/venue-owner/notificationsApi";
import { useAppSelector } from "@/redux/store/hooks";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";
import { BookingChart } from "@/components/admin/dashboard/booking-chart";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { subMonths, startOfMonth, format } from "date-fns";
import type { VenueDashboardData, Booking, Payment } from "@/types/api";

export default function VenueOwnerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const currentUserId = user?.userId || "";

  const {
    data: venuesResponse,
    isLoading,
    isError,
  } = useGetVenuesQuery(
    { userId: currentUserId },
    { skip: !currentUserId } // Skip query if no user ID is available
  );

  // Extract venues from the response
  const ownerVenues = Array.isArray(venuesResponse) ? venuesResponse : [];

   



  // Get dashboard data
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = useGetVenueDashboardDataQuery(
    { userId: currentUserId },
    // { skip: !currentUserId } // Skip query if no user ID is available
  );

  // Get notifications
  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    isError: isNotificationsError,
  } = useGetNotificationsQuery(
    { userId: currentUserId },
    // { skip: !currentUserId }
  );
  
  const notifications = notificationsData?.notifications || [];

  // Prepare data for charts from dashboard data
  const postStats = (dashboardData as any)?.post_statics || [];
  const reelStats = (dashboardData as any)?.reel_statics || [];

  // Get data from dashboard response
  const totalBookings = (dashboardData as any)?.total_books || 0;
  const totalRevenue = (dashboardData as any)?.total_earnings || 0;
  const totalCourts = (dashboardData as any)?.total_courts || 0;
  const pendingBookings = (dashboardData as any)?.pending_books || 0;

  // Use actual recent bookings from dashboard data if available
  const recentBookings: Booking[] = (dashboardData as any)?.recentBookings || [];
  const recentPayments: Payment[] = [];

  const {
    data: courts = [],
    isLoading: isCourtsLoading,
    isError: isCourtsError,
  } = useGetCourtsQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Venue Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your venues and bookings
          </p>
        </div>
      </div>

      <div className="space-y-4">
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
                    {(dashboardData as any)?.total_books ?? 0}
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
                    Rs.{((dashboardData as any)?.total_earnings ?? 0).toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courts
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
                    {(dashboardData as any)?.total_courts ?? 0}
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
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  <BookingChart data={postStats} />
                  <RevenueChart reelStats={reelStats} />
                </div>
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
              ) : null}
            </div>
          </div>

          {/* Recent Activities */}
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
                            {booking.status === "PENDING" ? "New" : ""} Booking
                            #{booking.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.bookingDate} • {booking.startTime}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent bookings found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div> */}
      </div>
    </div>
  );
}

// Child component for venue card with courts
function VenueCardWithCourts({ venue }: { venue: any }) {
  const {
    data: courts = [],
    isLoading: isCourtsLoading,
    isError: isCourtsError,
  } = useGetCourtsQuery();
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
