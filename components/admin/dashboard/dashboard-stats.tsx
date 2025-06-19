"use client";

import { useGetDashboardDataQuery } from "@/redux/api/admin/dashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, MapPin, Calendar, CreditCard } from "lucide-react";

export function DashboardStats() {
  const { data, isLoading, isError } = useGetDashboardDataQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">
          Error loading dashboard data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.normal_user_count +
              data.venue_user_count +
              data.admin_user_count}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium">{data.normal_user_count}</span> normal
            users, <span className="font-medium">{data.venue_user_count}</span>{" "}
            venue owners,{" "}
            <span className="font-medium">{data.admin_user_count}</span> admins
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.venue_count}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium">{data.court_count}</span> courts
            available
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.booking_count}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium">{data.venue_application_count}</span>{" "}
            pending applications
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Rs.{data.total_income.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            From all bookings and services
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
