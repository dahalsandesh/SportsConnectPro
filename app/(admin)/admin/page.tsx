import { Suspense } from "react"
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Bell } from "lucide-react"

export default function AdminDashboardPage() {
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
          <Suspense fallback={<div>Loading stats...</div>}>
            <DashboardStats />
          </Suspense>

          {/* Additional dashboard content can go here */}
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics will be displayed here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <Activity className="h-12 w-12 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Analytics content will be implemented in the next phase</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Detailed reports will be displayed here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <Activity className="h-12 w-12 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Reports content will be implemented in the next phase</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>System notifications will be displayed here</CardDescription>
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
  )
}
