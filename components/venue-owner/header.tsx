"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { useLogoutMutation } from "@/redux/api/common/authApi";
import { logout } from "@/redux/features/authSlice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Menu,
  User,
  LogOut,
  Settings,
  Search,
  Check,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useGetNotificationsQuery } from "@/redux/api/venue-owner/notificationsApi";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  CreditCard,
  BarChart,
  Clock,
  Trophy,
  Video,
  NewspaperIcon,
} from "lucide-react";

export function VenueOwnerHeader() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [logoutApi] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only fetch notifications on the client side
  const {
    data: notificationsData = { count: 0, notifications: [] },
    isLoading,
    refetch,
  } = useGetNotificationsQuery(
    { userId: user?.userId },
    { 
      skip: !mounted || !user?.userId,
      pollingInterval: 30000, // Refetch every 30 seconds
    }
  );
  
  const notifications = notificationsData.notifications || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // These functions are no longer needed as the API endpoints were removed
  const handleMarkAsRead = async (notificationId: string) => {
    // No-op as the endpoint was removed
  };

  const handleDelete = async (notificationId: string) => {
    // No-op as the endpoint was removed
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      toast({
        title: "Logged out",
        description: "You have been logged out successfully"
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logout());
      router.push("/login");
    }
  };

  // Notification handlers are now no-op functions since the API endpoints were removed

  // Ensure notifications is an array before filtering
  const unreadNotifications = Array.isArray(notifications) ? notifications.filter((n: any) => !n.isRead) : [];
  const readNotifications = Array.isArray(notifications) ? notifications.filter((n: any) => n.isRead) : [];

  const initials = user.fullName
    ? `${user.fullName.split(" ")[0][0]}${
        user.fullName.split(" ")[1]?.[0] || ""
      }`
    : user.userName?.[0] || "V";

  // Don't render anything on the server to prevent hydration mismatch
  if (!mounted) {
    return <header className="sticky top-0 z-40 border-b bg-background dark:border-border/50 h-16" />;
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background dark:border-border/50">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-2">
                {[
                  { title: "Dashboard", href: "/venue-owner", icon: <LayoutDashboard className="h-5 w-5" /> },
                  { title: "My Venue", href: "/venue-owner/venues", icon: <MapPin className="h-5 w-5" /> },
                  { title: "Bookings", href: "/venue-owner/bookings", icon: <Calendar className="h-5 w-5" /> },
                  { title: "Time Slots", href: "/venue-owner/availability", icon: <Clock className="h-5 w-5" /> },
                  { title: "Events", href: "/venue-owner/events", icon: <Trophy className="h-5 w-5" /> },
                  { title: "Posts & News", href: "/venue-owner/posts", icon: <NewspaperIcon className="h-5 w-5" /> },
                  { title: "Reels", href: "/venue-owner/reels", icon: <Video className="h-5 w-5" /> },
                  { title: "Payments", href: "/venue-owner/payments", icon: <CreditCard className="h-5 w-5" /> },
                  { title: "Analytics", href: "/venue-owner/analytics", icon: <BarChart className="h-5 w-5" /> },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/venue-owner" className="flex items-center gap-2">
            <span className="text-xl font-bold">SportConnect Pro</span>
          </Link>
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-2">
          <Link href="/venue-owner" className="flex items-center gap-2">
            <span className="text-xl font-bold">SportConnect Pro</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookings..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px] dark:border-input/80 focus:dark:border-primary"
            />
          </div>
          <ThemeToggle />
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[350px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications found.
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    {unreadNotifications.length > 0 && (
                      <div className="space-y-2 p-2">
                        {unreadNotifications.map((notification: any) => (
                          <div
                            key={notification.notificationId}
                            className="p-3 bg-muted rounded-lg space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(
                                    new Date(notification.createdAt),
                                    "PPp"
                                  )}
                                </p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Unread
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {readNotifications.length > 0 && (
                      <div className="space-y-2 p-2">
                        {readNotifications.map((notification: any) => (
                          <div
                            key={notification.notificationId}
                            className="p-3 border rounded-lg space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(
                                    new Date(notification.createdAt),
                                    "PPp"
                                  )}
                                </p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Read
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  {user.profileImage ? (
                    <AvatarImage
                      src={user.profileImage || "/placeholder.svg"}
                      alt={user.fullName || user.userName}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.fullName || user.userName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/venue-owner/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/venue-owner/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
