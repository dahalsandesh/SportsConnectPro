"use client";

import React, { useState, useEffect } from "react";
import { useGetNotificationsQuery } from "@/redux/api/venue-owner/notificationsApi";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Check, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function NotificationManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: notificationsData = { count: 0, notifications: [] },
    isLoading,
    refetch,
  } = useGetNotificationsQuery(
    { userId: user?.userId },
    { skip: !isMounted || !user?.userId }
  );

  const { notifications = [], count: unreadCount = 0 } = notificationsData;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Note: Venue notifications API doesn't have markAsRead endpoint
      // This would need to be implemented if the API supports it
      toast({
        title: "Info",
        description:
          "Mark as read functionality not available for venue notifications",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        // Note: Venue notifications API doesn't have delete endpoint
        // This would need to be implemented if the API supports it
        toast({
          title: "Info",
          description:
            "Delete functionality not available for venue notifications",
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete notification",
          variant: "destructive",
        });
      }
    }
  };

  const unreadNotifications = notifications.filter((n: any) => !n.isRead);
  const readNotifications = notifications.filter((n: any) => n.isRead);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage your notifications ({unreadCount} unread)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-muted-foreground">No notifications found.</div>
        ) : (
          <div className="space-y-6">
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Unread Notifications</h3>
                <div className="space-y-2">
                  {unreadNotifications.map((notification: any) => (
                    <div
                      key={notification.notificationId}
                      className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(notification.createdAt), "PPp")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleMarkAsRead(notification.notificationId)
                            }>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDelete(notification.notificationId)
                            }>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read Notifications */}
            {readNotifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Read Notifications</h3>
                <div className="space-y-2">
                  {readNotifications.map((notification: any) => (
                    <div
                      key={notification.notificationId}
                      className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(notification.createdAt), "PPp")}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(notification.notificationId)
                          }>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
