"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard,
  Video,
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
  Bot
} from "lucide-react"

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  submenu?: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
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
    title: "Posts",
    href: "/admin/posts",
    icon: <Newspaper className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "Reels",
    href: "/admin/reels",
    icon: <Video className="h-5 w-5" />,
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    submenu: [
      {
        title: "Users",
        href: "/admin/settings/users",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Cities",
        href: "/admin/settings/cities",
        icon: <MapPin className="h-4 w-4" />,
      },
      {
        title: "AI model train",
        href: "/admin/settings/ai-model-train",
        icon: <Bot className="h-4 w-4" />,
      },
    ],
  },
  // {
  //   title:"Posts",
  //   href:"/admin/posts",
  //   icon:<FileText className="h-5 w-5" />,
  // },
  // {
  //   title: "Messages",
  //   href: "/admin/messages",
  //   icon: <MessageSquare className="h-5 w-5" />,
  // },
  // {
  //   title: "Settings",
  //   href: "/admin/settings",
  //   icon: <Settings className="h-5 w-5" />,
  // },
  // {
  //   title: "Help",
  //   href: "/admin/help",
  //   icon: <HelpCircle className="h-5 w-5" />,
  // },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span>Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                      (pathname?.startsWith("/admin/settings") && openSubmenu === item.title)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {item.title}
                    </div>
                    <svg
                      className={`h-4 w-4 transition-transform ${
                        openSubmenu === item.title ? 'rotate-180' : ''
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {openSubmenu === item.title && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                            pathname === subItem.href
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className="mr-3">{subItem.icon}</span>
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
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
