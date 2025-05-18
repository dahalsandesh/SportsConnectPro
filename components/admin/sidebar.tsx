"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart, Users, Settings, MapPin, Calendar, CreditCard, Building, FileText, Home, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLogoutMutation } from "@/redux/services/authApi"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [logout] = useLogoutMutation()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={cn("pb-12 h-full flex flex-col", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Dashboard</h2>
          <div className="space-y-1">
            <Link href="/admin" passHref>
              <Button variant={pathname === "/admin" ? "secondary" : "ghost"} className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>
            <Link href="/admin/cities" passHref>
              <Button variant={pathname === "/admin/cities" ? "secondary" : "ghost"} className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Cities
              </Button>
            </Link>
            <Link href="/admin/sport-categories" passHref>
              <Button
                variant={pathname === "/admin/sport-categories" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                Sport Categories
              </Button>
            </Link>
            <Link href="/admin/venues" passHref>
              <Button variant={pathname === "/admin/venues" ? "secondary" : "ghost"} className="w-full justify-start">
                <Building className="mr-2 h-4 w-4" />
                Venues
              </Button>
            </Link>
            <Link href="/admin/bookings" passHref>
              <Button variant={pathname === "/admin/bookings" ? "secondary" : "ghost"} className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Bookings
              </Button>
            </Link>
            <Link href="/admin/users" passHref>
              <Button variant={pathname === "/admin/users" ? "secondary" : "ghost"} className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/admin/payments" passHref>
              <Button variant={pathname === "/admin/payments" ? "secondary" : "ghost"} className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Payments
              </Button>
            </Link>
            <Link href="/admin/reports" passHref>
              <Button variant={pathname === "/admin/reports" ? "secondary" : "ghost"} className="w-full justify-start">
                <BarChart className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </Link>
            <Link href="/admin/settings" passHref>
              <Button variant={pathname === "/admin/settings" ? "secondary" : "ghost"} className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
