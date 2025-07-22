"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import { TrendingUp, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PostStat {
  category: string
  post_count: number
}

interface BookingChartProps {
  data: PostStat[]
}

const COLORS = [
  'url(#colorIndigo)',
  'url(#colorCyan)',
  'url(#colorViolet)',
  'url(#colorPink)',
  'url(#colorAmber)',
  'url(#colorEmerald)',
  'url(#colorRed)',
  'url(#colorTeal)',
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (!data) return null;
    
    const total = data?.total || 1; // Prevent division by zero
    const postCount = data?.post_count || 0;
    const percentage = total > 0 ? ((postCount / total) * 100).toFixed(1) : '0.0';
    
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
            {label || 'Unknown'}
          </p>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {postCount.toLocaleString()} <span className="text-sm font-normal text-gray-500">posts</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{percentage}% of total</p>
        </div>
      </div>
    )
  }
  return null;
}

interface PostStat {
  category: string;
  post_count: number;
}

export function BookingChart({ data = [] }: { data?: PostStat[] }) {
  console.log('BookingChart received data:', data);
  
  // Ensure data is an array and has the expected structure
  const validData = Array.isArray(data) 
    ? data
        .filter(item => item && typeof item === 'object' && 'category' in item && 'post_count' in item)
        .map(item => ({
          category: String(item.category || 'Unknown'),
          post_count: Number(item.post_count) || 0
        }))
    : []
  
  console.log('Processed validData:', validData);

  // Sort by post count in descending order and limit to top 5
  const sortedData = [...validData]
    .sort((a, b) => b.post_count - a.post_count)
    .slice(0, 5);
    
  const totalPosts = sortedData.reduce((sum, item) => sum + item.post_count, 0);
  const maxValue = Math.max(...sortedData.map(item => item.post_count), 0);
  
  // Add total to each data point for percentage calculation
  const chartData = sortedData.map(item => ({
    ...item,
    total: totalPosts
  }));
  
  console.log('Sorted data for chart:', sortedData);

  return (
    <Card className="border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-sm overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800/50 [mask-image:linear-gradient(0deg,transparent,white_20%)]" />
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Posts by Category</CardTitle>
                <p className="text-xs text-muted-foreground">Distribution of posts across sport categories</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 pt-0 pb-6">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 20,
                }}
                barCategoryGap={14}
                barSize={36}
              >
                <defs>
                  <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#67E8F9" />
                  </linearGradient>
                  <linearGradient id="colorViolet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#C4B5FD" />
                  </linearGradient>
                  <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#F9A8D4" />
                  </linearGradient>
                  <linearGradient id="colorAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FCD34D" />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="category" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                  tickMargin={16}
                  interval={0}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  width={30}
                  tickFormatter={(value) => value === 0 ? '' : value}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Bar 
                  dataKey="post_count" 
                  radius={[6, 6, 0, 0]}
                  animationBegin={100}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    />
                  ))}
                  <LabelList 
                    dataKey="post_count" 
                    position="top" 
                    fill="#4B5563"
                    fontSize={12}
                    fontWeight={600}
                    offset={10}
                    formatter={(value: number) => value}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2" />
              <span>Total Posts: {sortedData.reduce((sum, item) => sum + item.post_count, 0)}</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-3.5 w-3.5 mr-1 text-emerald-500" />
              <span>+12% from last month</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
