import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { Loader2, Calendar, Clock, Info, CheckCircle, XCircle } from "lucide-react"
import { skipToken } from "@reduxjs/toolkit/query"
import { useGetNotificationByIdQuery } from "@/redux/api/venue-owner/notificationsApi"
import type { VenueNotification } from "@/types/venue-owner-api"
import React from "react"

// Helper function to parse and format date
function getFormattedDate(dateString: string | Date | undefined): string {
  if (!dateString) return 'Date not available';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, "MMM d, yyyy 'at' h:mm a");
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

// Helper function to determine the notification icon
const getNotificationIcon = (notification: VenueNotification): JSX.Element => {
  const message = (notification.Message || notification.message || '').toLowerCase();
  
  if (message.includes('success')) {
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  }
  if (message.includes('error') || message.includes('failed')) {
    return <XCircle className="h-5 w-5 text-red-500" />;
  }
  return <Info className="h-5 w-5 text-blue-500" />;
};

interface NotificationDetailsModalProps {
  notificationId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function VenueNotificationDetailsModal({
  notificationId,
  onOpenChange,
}: NotificationDetailsModalProps): JSX.Element {
  const isOpen = !!notificationId;

  const { data: notification, isLoading } = useGetNotificationByIdQuery(
    notificationId ?? skipToken,
    {
      skip: !notificationId,
    }
  );

  // Safely get notification properties
  const getNotificationField = (field: keyof VenueNotification, fallback: string = 'N/A'): string => {
    if (!notification) return fallback;
    const value = notification[field as keyof typeof notification];
    return value ? String(value) : fallback;
  };

  // Check if notification has been read
  const isRead = notification?.IsRead ?? notification?.isRead ?? false;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {notification && getNotificationIcon(notification)}
            <span>Notification Details</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : notification ? (
              <div className="space-y-6">
                {/* Main Message */}
                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="text-foreground">
                    {getNotificationField('Message', getNotificationField('message', 'No message content'))}
                  </p>
                </div>

                {/* Metadata */}
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <Badge variant={isRead ? "outline" : "default"} className="ml-2">
                      {isRead ? "Read" : "Unread"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Type</span>
                    <span className="text-sm font-medium">
                      {getNotificationField('Title', getNotificationField('title', 'General'))}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Date</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{getFormattedDate(new Date(notification.CreatedAt || notification.createdAt || ''))}</span>
                    </div>
                  </div>
                  
                  {(notification.UpdatedAt || notification.updatedAt) && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{getFormattedDate(new Date(notification.UpdatedAt || notification.updatedAt || ''))}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Details - Only show if there are other properties */}
                {(notification.NotificationID || notification.User_id) && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Additional Details</h4>
                    <div className="space-y-2 rounded-md border p-3 text-sm">
                      {notification.NotificationID && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Notification ID:</span>
                          <span className="font-mono text-xs break-all max-w-[200px] text-right">
                            {notification.NotificationID}
                          </span>
                        </div>
                      )}
                      {notification.User_id && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">User ID:</span>
                          <span className="font-mono text-xs break-all max-w-[200px] text-right">
                            {notification.User_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No notification details available
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
