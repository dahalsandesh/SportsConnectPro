"use client";

import React, { useState, useEffect } from "react";
import { useGetNotificationsQuery, useGetNotificationByIdQuery } from "@/redux/api/venue-owner/notificationsApi";
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
import { Bell, Check, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { VenueNotificationDetailsModal } from "@/components/venue-owner/notification-details-modal";

export default function NotificationManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

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
    setNotificationToDelete(notificationId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!notificationToDelete) return;
    
    try {
      // Note: Venue notifications API doesn't have delete endpoint
      // This would need to be implemented if the API supports it
      toast({
        title: "Info",
        description: "Delete functionality not available for venue notifications",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setNotificationToDelete(null);
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    setSelectedNotificationId(notificationId);
  };

  const unreadNotifications = notifications.filter((n: any) => !n.isRead);
  const readNotifications = notifications.filter((n: any) => n.isRead);

  return (
    <>
      <VenueNotificationDetailsModal
        notificationId={selectedNotificationId}
        onOpenChange={(open) => {
          if (!open) setSelectedNotificationId(null);
        }}
        onMarkAsRead={handleMarkAsRead}
      />

      {/* Delete Confirmation Dialog */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${isDeleteDialogOpen ? 'block' : 'hidden'}`}>
        <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Delete Notification</h3>
            <button 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mb-6">Are you sure you want to delete this notification? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setNotificationToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={!notificationToDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  {unreadCount === 0 
                    ? 'No unread notifications' 
                    : `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
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
                      className="p-4 bg-muted/50 hover:bg-muted transition-colors rounded-lg space-y-2 cursor-pointer"
                      onClick={() => handleNotificationClick(notification.notificationId)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                            <p className="font-medium">{notification.title || 'Notification'}</p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
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
                      className="p-4 border rounded-lg space-y-2 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => handleNotificationClick(notification.notificationId)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{notification.title || 'Notification'}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
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
    </>
  );
}
