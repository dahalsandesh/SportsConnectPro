"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useGetSportTypeDataQuery } from "@/redux/api/dashboard/dashboardApi"

interface SportTypeData {
  name: string
  count: number
}

interface DashboardData {
  sportTypes: SportTypeData[]
}

export function SportTypeChart() {
  const { data: dashboardData, isLoading } = useGetSportTypeDataQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!dashboardData?.sportTypes) {
    return <div>No data available</div>
  }

  const COLORS = ["#3b82f6", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sport Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dashboardData.sportTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="count"
              >
                {dashboardData.sportTypes.map((entry: SportTypeData, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
