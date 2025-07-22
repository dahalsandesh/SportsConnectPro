"use client"

import { useRouter, usePathname } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/hooks/redux"
import { useLogoutMutation } from "@/redux/api/common/authApi"
import { logout } from "@/redux/features/authSlice"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings, Search, Bell, X, Clock, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { dashboardNavItems, dashboardHeaderConfig } from "@/config/dashboard-nav"
import { 
  useGetNotificationsQuery, 
  useLazyGetNotificationByIdQuery,
  type Notification 
} from "@/redux/api/user/notificationsApi"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAppSelector((state) => state.auth)
  const { menu: MenuIcon } = dashboardHeaderConfig.icons
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [logoutApi] = useLogoutMutation()
  
  // Notification state
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null)
  
  // Fetch notifications
  const { 
    data: notificationsData, 
    isLoading: isLoadingNotifications, 
    refetch: refetchNotifications 
  } = useGetNotificationsQuery(
    { userId: user?.userId || '' },
    { skip: !user?.userId }
  )
  
  // Get notification by ID
  const [fetchNotification, { 
    data: notificationDetails, 
    isLoading: isLoadingNotificationDetails 
  }] = useLazyGetNotificationByIdQuery()
  
  // Handle notification click - fetch details
  const handleNotificationClick = useCallback((notificationId: string) => {
    setSelectedNotificationId(notificationId)
    fetchNotification(notificationId)
  }, [fetchNotification])
  
  // Close notification details
  const closeDetails = useCallback(() => {
    setSelectedNotificationId(null)
    // Refetch notifications to update read status
    refetchNotifications()
  }, [refetchNotifications])

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) {
    return null
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap()
      dispatch(logout())
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive" as const,
      })
    }
  }

  const initials = user?.fullName
    ? `${user.fullName.split(" ")[0][0]}${user.fullName.split(" ")[1]?.[0] || ""}`
    : user?.userName?.[0] || "U"

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center border-b px-4">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-primary">Sports</span>
                    <span>Connect</span>
                  </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                  <div className="grid gap-1 px-2">
                    {dashboardNavItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Button
                          key={item.href}
                          variant={pathname === item.href ? "secondary" : "ghost"}
                          className={`w-full justify-start gap-2 ${pathname === item.href ? "bg-secondary" : ""}`}
                          asChild
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href={item.href}>
                            <Icon className="h-5 w-5" />
                            {item.title}
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          {/* Logo removed from header as it's in the sidebar */}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  {notificationsData?.count ? (
                    <Badge 
                      variant="destructive" 
                      className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0"
                    >
                      {notificationsData.count}
                    </Badge>
                  ) : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-h-[80vh] overflow-y-auto p-0" align="end">
                <div className="flex items-center justify-between p-3 border-b">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifications(true);
                    }}
                  >
                    View All
                  </Button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  {isLoadingNotifications ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : notificationsData?.notifications?.length ? (
                    notificationsData.notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem 
                        key={notification.NotificationID}
                        className="p-3 hover:bg-accent/50 cursor-pointer gap-3"
                        onClick={() => handleNotificationClick(notification.NotificationID)}
                      >
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Bell className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-medium text-sm">
                              {notification.Message.split(' ').slice(0, 5).join(' ')}
                              {notification.Message.split(' ').length > 5 ? '...' : ''}
                            </h4>
                            {!notification.IsRead && (
                              <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.Message}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>{format(new Date(notification.CreatedAt), 'MMM d, h:mm a')}</span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                      <Bell className="h-6 w-6 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No notifications yet</p>
                    </div>
                  )}
                </div>
                {notificationsData?.notifications?.length ? (
                  <div className="border-t p-2 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => setShowNotifications(true)}
                    >
                      View All Notifications
                    </Button>
                  </div>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notification Details Dialog */}
            <Dialog open={!!selectedNotificationId} onOpenChange={(open) => !open && closeDetails()}>
              <DialogContent className="max-w-md sm:max-w-xl max-h-[80vh] flex flex-col p-0">
                {isLoadingNotificationDetails ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : notificationDetails ? (
                  <>
                    <DialogHeader className="border-b p-4">
                      <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg">Notification Details</DialogTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={closeDetails}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </Button>
                      </div>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-base font-medium">
                          {notificationDetails.Message.split(' ').slice(0, 8).join(' ')}
                          {notificationDetails.Message.split(' ').length > 8 ? '...' : ''}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{format(new Date(notificationDetails.CreatedAt), 'MMMM d, yyyy h:mm a')}</span>
                        </div>
                      </div>
                      
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{notificationDetails.Message}</p>
                      </div>
                      
                      {notificationDetails.Link && (
                        <div className="pt-2">
                          <Button asChild>
                            <Link href={notificationDetails.Link} target="_blank">
                              View Details
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">Unable to load notification details</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user?.fullName} />
                    <AvatarFallback>
                      {user?.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
