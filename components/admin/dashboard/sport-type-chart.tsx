"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useGetSportCategoriesQuery } from "@/redux/api/admin/sportCategoriesApi";
import type { SportCategory } from "@/types/api";

interface ChartData {
  name: string;
  value: number;
}

export function SportTypeChart() {
  const {
    data: sportCategories,
    isLoading,
    isError,
  } = useGetSportCategoriesQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sport Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !sportCategories || sportCategories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sport Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-destructive">
          No sport categories available
        </CardContent>
      </Card>
    );
  }

  // Transform the data for the chart
  const chartData: ChartData[] = sportCategories.map(
    (category: SportCategory) => ({
      name: category.sportCategory,
      value: 1, // Default value since count isn't part of the SportCategory type
    })
  );

  const COLORS = [
    "#3b82f6",
    "#f43f5e",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sport Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name }) => name}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} occurrence`, "Count"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
