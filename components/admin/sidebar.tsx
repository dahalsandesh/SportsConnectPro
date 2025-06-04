"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  MapPin,
  Calendar,
  Settings,
  CreditCard,
  Trophy,
  BarChart,
  MessageSquare,
  HelpCircle,
  FileText,
  Newspaper,
} from "lucide-react"

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Venues",
    href: "/admin/venues",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "Venue Applications",
    href: "/admin/venue-applications",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "News & Media",
    href: "/admin/news",
    icon: <Newspaper className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Help",
    href: "/admin/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="text-primary">Admin</span>
          <span>Dashboard</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn("justify-start gap-2", isActive && "bg-secondary")}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Need help?</p>
            <p className="text-xs text-muted-foreground">Check our documentation</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
