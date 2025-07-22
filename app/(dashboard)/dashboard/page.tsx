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
    data: stats, 
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

  // Filter bookings by status
  const upcomingBookings = allBookings.filter(b => b.status === 'Pending' || b.status === 'Success');
  const pastBookings = allBookings.filter(b => b.status === 'Rejected' || b.status === 'Cancelled');
  
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
  
  // Calculate stats
  const totalSpent = stats?.total_revenue || 0;
  const upcomingCount = upcomingBookings.length;
  const pastCount = pastBookings.length;
  const cancelledCount = stats?.booking_reject_count || 0;

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
          title="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4" />}
          description="All time"
        />
        <DashboardStatCard
          title="Upcoming Bookings"
          value={upcomingCount}
          icon={<Calendar className="h-4 w-4" />}
          description={`${pastCount} past bookings`}
        />
        <DashboardStatCard
          title="Cancelled"
          value={cancelledCount}
          icon={<Clock className="h-4 w-4" />}
          description="All time"
        />
        <DashboardStatCard
          title="Active Now"
          value="0"
          icon={<CheckCircle className="h-4 w-4" />}
          description="Currently playing"
        />
      </div>

      {/* Bookings Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/bookings">View All Bookings</Link>
          </Button>
        </div>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings?.length > 0 ? (
            <BookingList bookings={upcomingBookings} />
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-medium">No upcoming bookings</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any upcoming bookings.
                </p>
                <Button className="mt-4 text-white" variant="default" asChild size="sm" color="primary">
                  <Link href="/venues">Book a court</Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings?.length > 0 ? (
            <BookingList bookings={pastBookings} />
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-medium">No past bookings</h3>
                <p className="text-sm text-muted-foreground">
                  Your past bookings will appear here.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
