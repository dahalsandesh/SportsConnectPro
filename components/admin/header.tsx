"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { sidebarItems } from "./sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetAdminNotificationsQuery, useMarkNotificationAsReadMutation } from "@/redux/api/admin/notificationsApi";
import { NotificationDetailsModal } from "./notification-details-modal";

export function NotificationBell() {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const { data, isLoading, error, refetch } = useGetAdminNotificationsQuery(
    user?.userId ? { userId: user.userId } : undefined
  );
  const unreadCount = data?.notifications.filter((n) => !n.IsRead).length || 0;

  const handleNotificationClick = (notificationId: string) => {
    setSelectedNotificationId(notificationId);
  };

  const handleCloseModal = () => {
    setSelectedNotificationId(null);
    refetch(); // Refresh notifications when modal is closed
  };
  return (
    <>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-y-auto p-0">
        <div className="p-4 border-b">
          <span className="font-semibold">Notifications</span>
        </div>
        {isLoading && <div className="p-4">Loading...</div>}
        {error && (
          <div className="p-4 text-red-500">Error fetching notifications</div>
        )}
        {data?.notifications.length === 0 && !isLoading && !error && (
          <div className="p-4 text-muted-foreground">No notifications</div>
        )}
        {data?.notifications.map((notification) => (
          <div
            key={notification.NotificationID}
            className="flex items-start gap-2 p-3 border-b last:border-b-0 bg-background hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => handleNotificationClick(notification.NotificationID)}>
            <div className="flex-shrink-0 mt-1">
              {!notification.IsRead ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <Check className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-grow">
              <p className="font-semibold">Notification</p>
              <p className="text-sm text-muted-foreground">
                {notification.Message}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(notification.CreatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </DropdownMenuContent>
      </DropdownMenu>
      <NotificationDetailsModal
        notificationId={selectedNotificationId}
        onOpenChange={(open) => !open && setSelectedNotificationId(null)}
      />
    </>
  );
}

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
        variant: "success",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logout());
      router.push("/login");
    }
  };

  const initials = user.fullName
    ? `${user.fullName.split(" ")[0][0]}${
        user.fullName.split(" ")[1]?.[0] || ""
      }`
    : user.userName?.[0] || "A";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex h-full flex-col">
                <div className="p-4">
                  <Link href="/admin" className="text-lg font-semibold">
                    Admin Panel
                  </Link>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                  {sidebarItems.map((item) => {
                    const Icon = () =>
                      item.icon &&
                      React.cloneElement(item.icon, {
                        className: "mr-2 h-4 w-4",
                      });

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}>
                        <Icon />
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/admin" className="hidden md:block text-lg font-semibold">
            Admin Panel
          </Link>
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
            <ThemeToggle />
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full">
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
                  <Link href="/admin/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer">
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
      </div>
    </header>
  );
}
