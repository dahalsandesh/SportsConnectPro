"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

// Sample data for charts
const bookingData = [
  { name: "Jan", bookings: 65 },
  { name: "Feb", bookings: 59 },
  { name: "Mar", bookings: 80 },
  { name: "Apr", bookings: 81 },
  { name: "May", bookings: 56 },
  { name: "Jun", bookings: 55 },
  { name: "Jul", bookings: 40 },
]

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4780 },
  { name: "May", revenue: 5890 },
  { name: "Jun", revenue: 6390 },
  { name: "Jul", revenue: 7490 },
]

const sportTypeData = [
  { name: "Futsal", value: 45 },
  { name: "Basketball", value: 25 },
  { name: "Tennis", value: 15 },
  { name: "Badminton", value: 10 },
  { name: "Others", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function BookingChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Booking Overview</CardTitle>
        <CardDescription>Number of bookings per month</CardDescription>
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
  )
}

export function RevenueChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue in Rs.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`Rs.${value}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function SportTypeChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Sport Types</CardTitle>
        <CardDescription>Distribution by sport type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sportTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sportTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
