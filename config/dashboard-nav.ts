import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Calendar,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  Search,
  Menu as MenuIcon,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export const dashboardNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Registered Events",
    href: "/dashboard/registered-events",
    icon: Calendar,
  },
  // {
  //   title: "Notifications",
  //   href: "/dashboard/notifications",
  //   icon: Bell,
  // },
  // {
  //   title: "Profile",
  //   href: "/dashboard/profile",
  //   icon: UserIcon,
  // },
  {
    title: "Help",
    href: "/dashboard/help",
    icon: Settings,
  },
]

export const dashboardHeaderConfig = {
  logo: {
    text: "Sports Connect",
    href: "/dashboard",
  },
  navItems: dashboardNavItems,
  userMenu: {
    profile: {
      label: "Profile",
      href: "/dashboard/profile",
      icon: UserIcon,
    },
    settings: {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    logout: {
      label: "Log out",
      icon: LogOut,
    },
  },
  icons: {
    search: Search,
    menu: MenuIcon,
    close: X,
    chevronDown: ChevronDown,
    chevronRight: ChevronRight,
  },
}
