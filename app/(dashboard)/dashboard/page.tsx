"use client"

import { useAppSelector } from "@/hooks/redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CreditCard, MapPin, Trophy, ArrowUpRight, Heart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useGetBookingsQuery } from '@/redux/api/bookings/bookingsApi'
import React from "react";

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
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <div className="flex items-center text-xs text-muted-foreground">{description}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { data: bookingsData, isLoading: isBookingsLoading, isError: isBookingsError } = useGetBookingsQuery({ limit: 1000 });

  // Filter bookings for this user
  const userBookings = (bookingsData?.data || []).filter(b => b.userEmail === user?.email);
  const totalBookings = userBookings.length;
  const totalSpent = userBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const upcomingBookings = userBookings
    .filter(b => ["CONFIRMED", "PENDING"].includes(b.status) && new Date(b.bookingDate) >= new Date())
    .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.fullName || user.userName}!</p>
        </div>
        <Button asChild>
          <Link href="/venues">
            <Search className="mr-2 h-4 w-4" />
            Find Venues
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Total Bookings"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          value={isBookingsLoading ? '...' : totalBookings}
          description={
            <>
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">{isBookingsLoading ? '' : `+${totalBookings}`}</span> total
            </>
          }
        />
        <DashboardStatCard
          title="Upcoming Events"
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          value={3}
          description={
            <>
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+1</span> new event this week
            </>
          }
        />
        <DashboardStatCard
          title="Favorite Venues"
          icon={<Heart className="h-4 w-4 text-muted-foreground" />}
          value={5}
          description={<span>Across 3 sports</span>}
        />
        <DashboardStatCard
          title="Total Spent"
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          value={isBookingsLoading ? '...' : `Rs. ${totalSpent}`}
          description={
            <>
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">{isBookingsLoading ? '' : `+Rs. ${totalSpent}`}</span> total
            </>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your next 3 scheduled bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isBookingsLoading ? (
                <div>Loading...</div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-muted-foreground">No upcoming bookings.</div>
              ) : (
                upcomingBookings.map((booking) => (
                  <div key={booking.bookingId} className="flex items-center gap-4 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{booking.court?.venueName} - {booking.court?.courtName}</p>
                      <p className="text-xs text-muted-foreground">{booking.bookingDate} • {booking.startTime} - {booking.endTime}</p>
                    </div>
                    <div className="text-sm font-medium">₹{booking.totalAmount}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your recent activities on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Booked Green Field Futsal</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Payment of ₹1,200 completed</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <Trophy className="h-4 w-4 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Registered for Summer Tournament</p>
                  <p className="text-xs text-muted-foreground">5 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <MapPin className="h-4 w-4 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Added Victory Court to favorites</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
