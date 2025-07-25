"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { dashboardNavItems } from "@/config/dashboard-nav"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-primary">SportsConnect</span>
          <span>Pro</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {dashboardNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-2", pathname === item.href && "bg-secondary")}
                asChild
              >
                <Link href={item.href} className="w-full text-left">
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
