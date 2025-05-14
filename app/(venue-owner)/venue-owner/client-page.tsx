"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, CreditCard, ArrowUpRight, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Sample data for charts
const bookingData = [
  { name: "Mon", bookings: 5 },
  { name: "Tue", bookings: 8 },
  { name: "Wed", bookings: 12 },
  { name: "Thu", bookings: 10 },
  { name: "Fri", bookings: 15 },
  { name: "Sat", bookings: 20 },
  { name: "Sun", bookings: 18 },
]

const revenueData = [
  { name: "Mon", revenue: 5000 },
  { name: "Tue", revenue: 8000 },
  { name: "Wed", revenue: 12000 },
  { name: "Thu", revenue: 10000 },
  { name: "Fri", revenue: 15000 },
  { name: "Sat", revenue: 20000 },
  { name: "Sun", revenue: 18000 },
]

const venueData = [
  { name: "Green Field Futsal", value: 45 },
  { name: "Urban Kicks Arena", value: 35 },
  { name: "Victory Court", value: 20 },
]

const COLORS = ["#16a34a", "#0ea5e9", "#f59e0b"]

export default function VenueOwnerDashboardClient() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Venue Dashboard</h1>
          <p className="text-muted-foreground">Manage your venues and bookings</p>
        </div>
        <Button asChild>
          <Link href="/venue-owner/venues/new">Add New Venue</Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">+1</span> from last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">+12%</span> from last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹88,000</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">+18%</span> from last month
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Bookings</CardTitle>
                <CardDescription>Number of bookings this week</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Venue Performance</CardTitle>
                <CardDescription>Bookings by venue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={venueData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {venueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Revenue</CardTitle>
                <CardDescription>Revenue this week in ₹</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                      <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest bookings for your venues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Green Field Futsal - Court A</p>
                      <p className="text-xs text-muted-foreground">Today, 6:00 PM - 7:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Urban Kicks Arena - Court B</p>
                      <p className="text-xs text-muted-foreground">Today, 8:00 PM - 9:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Victory Court - Main Court</p>
                      <p className="text-xs text-muted-foreground">Tomorrow, 5:00 PM - 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Green Field Futsal - Court B</p>
                      <p className="text-xs text-muted-foreground">Tomorrow, 7:00 PM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="venues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Venues</CardTitle>
              <CardDescription>Manage your venues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <MapPin className="h-12 w-12 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Venues content will be implemented in the next phase</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>Manage your bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Bookings content will be implemented in the next phase</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>Manage your payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <CreditCard className="h-12 w-12 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Payments content will be implemented in the next phase</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
