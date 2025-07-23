"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  useGetBookingsQuery, 
  useGetDashboardStatsQuery 
} from '@/redux/api/user/userApi'
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from "@/hooks/useAuth"

// Dynamically import client components with SSR disabled to avoid hydration issues
const BookingList = dynamic(
  () => import('@/components/user/booking-list').then((mod) => mod.BookingList),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> }
);

interface DashboardStatCardProps {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
}

function DashboardStatCard({ title, icon, value, description }: DashboardStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-5 w-5 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </CardContent>
    </Card>
  );
}

// Ensure client-side only rendering
const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
};

export default function DashboardPage() {
  const isClient = useIsClient();
  const { user } = useAuth();
  const userId = user?.userId || '';
  
  // Fetch dashboard stats
  const { 
    data: stats = {
      booking_count: 0,
      booking_pending_count: 0,
      booking_reject_count: 0,
      booking_success_count: 0,
      total_revenue: 0
    }, 
    isLoading: isStatsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useGetDashboardStatsQuery(
    { userId },
    { skip: !userId || !isClient }
  );
  
  // Fetch all bookings for the user
  const { 
    data: allBookings = [], 
    isLoading: isBookingsLoading,
    error: bookingsError,
    refetch: refetchBookings
  } = useGetBookingsQuery(
    { userId },
    { skip: !userId || !isClient }
  );

  // Ensure recentBookings is always an array and take first 3
  const recentBookings = Array.isArray(allBookings) ? allBookings.slice(0, 3) : [];
  
  // Log data for debugging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Dashboard stats:', stats);
      console.log('All bookings:', allBookings);
    }
  }, [stats, allBookings]);
  
  // Refetch data when user changes and queries are ready
  useEffect(() => {
    if (isClient && userId) {
      // Only refetch if the queries have been started
      const refetchData = async () => {
        try {
          await Promise.all([
            refetchStats(),
            refetchBookings()
          ]);
        } catch (error) {
          console.error('Error refetching data:', error);
        }
      };
      
      refetchData();
    }
  }, [isClient, userId]);

  const isLoading = isStatsLoading || isBookingsLoading;
  const hasError = statsError || bookingsError;
  
  // Calculate stats from API response
  // These are now directly used from the stats object in the JSX

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          <p>Failed to load dashboard data. Please try again later.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              if (userId) {
                refetchStats();
                refetchBookings();
              }
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.fullName || user?.userName || 'User'}!</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild className="bg-primary text-white">
            <Link href="/venues">New Booking</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Total Bookings"
          value={stats.booking_count}
          icon={<Calendar className="h-4 w-4" />}
          description="All time"
        />
        <DashboardStatCard
          title="Pending"
          value={stats.booking_pending_count}
          icon={<Clock className="h-4 w-4" />}
          description="Awaiting confirmation"
        />
        <DashboardStatCard
          title="Confirmed"
          value={stats.booking_success_count}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Successful bookings"
        />
        <DashboardStatCard
          title="Total Spent"
          value={`Rs. ${(stats.total_revenue || 0).toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          description="All time"
        />
      </div>

      {/* Recent Bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/bookings">View All</Link>
          </Button>
        </div>
        
        {recentBookings?.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking: any) => {
              const [startTime, endTime] = booking.ticket.split(' - ').map((time: string) => {
                try {
                  const [hours, minutes] = time.split(':').map(Number);
                  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } catch (e) {
                  return time;
                }
              });
              
              const statusVariant = booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  booking.status === 'Success' ? 'bg-green-100 text-green-800' : 
                                  'bg-red-100 text-red-800';
              
              return (
                <Card key={booking.bookingId} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Booking #{booking.bookingId?.split('-')[0]}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusVariant}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {startTime} - {endTime} • {booking.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Rs. {booking.price?.toLocaleString()}</div>
                        <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                          <Link href={`/dashboard/bookings/${booking.bookingId}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex h-[150px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <h3 className="text-lg font-medium">No bookings yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your bookings will appear here.
              </p>
              <Button className="text-white" asChild size="sm">
                <Link href="/venues">Book a court</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
