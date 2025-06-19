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
  Users,
  Calendar,
  CreditCard,
  ArrowUpRight,
  Activity,
  MapPin,
  Trophy,
  Bell,
} from "lucide-react";
import {
  BookingChart,
  RevenueChart,
  SportTypeChart,
} from "@/components/admin/dashboard-charts";
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { Suspense } from "react";

export default function AdminDashboardClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Loading...
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">...</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }>
            <DashboardStats />
          </Suspense>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Suspense
              fallback={
                <div className="col-span-4 h-[300px] flex items-center justify-center">
                  Loading...
                </div>
              }>
              <BookingChart />
            </Suspense>
            <Suspense
              fallback={
                <div className="col-span-3 h-[300px] flex items-center justify-center">
                  Loading...
                </div>
              }>
              <SportTypeChart />
            </Suspense>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Suspense
              fallback={
                <div className="col-span-4 h-[300px] flex items-center justify-center">
                  Loading...
                </div>
              }>
              <RevenueChart />
            </Suspense>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New booking created</p>
                      <p className="text-xs text-muted-foreground">
                        4 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New venue added</p>
                      <p className="text-xs text-muted-foreground">
                        6 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New event created</p>
                      <p className="text-xs text-muted-foreground">
                        8 hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed analytics will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <Activity className="h-12 w-12 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">
                  Analytics content will be implemented in the next phase
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Detailed reports will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <Activity className="h-12 w-12 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">
                  Reports content will be implemented in the next phase
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                System notifications will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <Bell className="h-12 w-12 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">
                  Notifications content will be implemented in the next phase
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
