"use client";

import { useState } from "react";
import { useGetAdminNotificationsQuery } from "@/redux/api/admin/notificationsApi";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NotificationBell() {
  const { data, isLoading, error } = useGetAdminNotificationsQuery();
  const [open, setOpen] = useState(false);
  const unreadCount = data?.notifications.filter((n) => !n.isRead).length || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <div className="max-h-80 overflow-y-auto">
          {isLoading && <div className="p-4">Loading...</div>}
          {error && (
            <div className="p-4 text-red-500">Error fetching notifications</div>
          )}
          {data?.notifications.length === 0 && (
            <div className="p-4 text-muted-foreground">No notifications</div>
          )}
          {data?.notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-2 p-2 border-b last:border-b-0">
              <div className="flex-shrink-0 mt-1">
                {!notification.isRead ? (
                  <Bell className="h-4 w-4 text-primary" />
                ) : (
                  <Check className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-grow">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
