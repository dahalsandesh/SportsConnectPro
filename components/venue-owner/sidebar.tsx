"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Settings,
  CreditCard,
  BarChart,
  MessageSquare,
  HelpCircle,
  Plus,
  Clock,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/venue-owner",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "My Venues",
    href: "/venue-owner/venues",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "Bookings",
    href: "/venue-owner/bookings",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Availability",
    href: "/venue-owner/availability",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Payments",
    href: "/venue-owner/payments",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/venue-owner/analytics",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "Messages",
    href: "/venue-owner/messages",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/venue-owner/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Help",
    href: "/venue-owner/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
]

export function VenueOwnerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/venue-owner" className="flex items-center gap-2 font-semibold">
          <span className="text-primary">Venue</span>
          <span>Management</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <div className="px-4 py-2">
          <Button className="w-full justify-start" asChild>
            <Link href="/venue-owner/venues/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Venue
            </Link>
          </Button>
        </div>
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("justify-start gap-2", pathname === item.href && "bg-secondary")}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Need help?</p>
            <p className="text-xs text-muted-foreground">Contact support</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
