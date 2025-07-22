"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Video, Film, MoreHorizontal, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReelStat {
  category: string
  post_count: number
}

interface RevenueChartProps {
  reelStats: ReelStat[]
}

const COLORS = [
  '#6366F1', // indigo-500
  '#06B6D4', // cyan-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#F59E0B', // amber-500
  '#10B981', // emerald-500
  '#EF4444', // red-500
  '#14B8A6', // teal-500
]

const RADIAN = Math.PI / 180

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (!data) return null;
    
    const total = data?.total || 1; // Prevent division by zero
    const value = data?.value || 0;
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
    
    // Safely extract color from fill
    let color = '#6366F1'; // Default color
    try {
      const fill = payload[0]?.fill || '';
      if (fill && typeof fill === 'string') {
        color = fill.includes('url(#') 
          ? fill.replace('url(#', '').replace(')', '') 
          : fill;
      }
    } catch (e) {
      console.error('Error processing fill color:', e);
    }
    
    return (
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
            {data.name || 'Unknown'}
          </p>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value.toLocaleString()} <span className="text-sm font-normal text-gray-500">reels</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{percentage}% of total</p>
        </div>
      </div>
    )
  }
  return null;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.1
  const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.1

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-[10px] font-bold pointer-events-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
      stroke="#00000040"
      strokeWidth={1}
      paintOrder="stroke"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

interface ReelStat {
  category: string;
  post_count: number;
}

export function RevenueChart({ reelStats = [] }: { reelStats?: ReelStat[] }) {
  // Ensure reelStats is an array and has the expected structure
  const validData = Array.isArray(reelStats) 
    ? reelStats
        .filter(item => item && typeof item === 'object' && 'category' in item && 'post_count' in item)
        .map(item => ({
          category: String(item.category || 'Unknown'),
          post_count: Number(item.post_count) || 0
        }))
    : []
  
  if (validData.length === 0) {
    return (
      <Card className="border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-sm h-full">
        <div className="relative h-full">
          <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800/50 [mask-image:linear-gradient(0deg,transparent,white_20%)]" />
          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Reels by Category</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 h-[calc(100%-60px)] flex flex-col items-center justify-center">
            <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-900/20 mb-3">
              <Film className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No reels data available
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Upload your first reel to see analytics
            </p>
          </CardContent>
        </div>
      </Card>
    )
  }

  // Sort by post count in descending order and limit to top 5
  const sortedData = [...validData]
    .sort((a, b) => (b?.post_count || 0) - (a?.post_count || 0))
    .slice(0, 5)

  // Calculate total reels for percentage with null checks
  const totalReels = sortedData.reduce((sum, item) => {
    const count = item?.post_count || 0
    return sum + count
  }, 0)
  
  // Prepare data for pie chart with null checks
  const pieData = sortedData
    .filter(item => item?.category && (item?.post_count || 0) > 0) // Filter out invalid items
    .map((item, index) => ({
      name: item?.category || 'Unknown',
      value: item?.post_count || 0,
      percentage: totalReels > 0 ? Math.round(((item?.post_count || 0) / totalReels) * 100) : 0,
      fill: COLORS[index % COLORS.length]
    }))

  return (
    <Card className="border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-sm h-full">
      <div className="relative h-full">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800/50 [mask-image:linear-gradient(0deg,transparent,white_20%)]" />
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                <Film className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Reels by Category</CardTitle>
                <p className="text-xs text-muted-foreground">Distribution of reels across categories</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 pt-0 pb-6">
          <div className="h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="gradient-indigo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <linearGradient id="gradient-cyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#67E8F9" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <linearGradient id="gradient-violet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="gradient-pink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F9A8D4" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                  <linearGradient id="gradient-amber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  animationBegin={100}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${['indigo', 'cyan', 'violet', 'pink', 'amber'][index % 5]})`}
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="transition-all duration-300 hover:opacity-90"
                      style={{
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.filter = 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15))';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))';
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '12px',
                  }}
                  formatter={(value, entry: any, index) => (
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                        {value} ({entry.payload.percentage}%)
                      </span>
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2" />
              <span>Total Reels: {totalReels}</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-3.5 w-3.5 mr-1 text-emerald-500" />
              <span>+8% from last month</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
