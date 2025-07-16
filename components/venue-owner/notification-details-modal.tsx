import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import { useGetNotificationByIdQuery } from "@/redux/api/venue-owner/notificationsApi"
import type { VenueNotification } from "@/types/venue-owner-api"

interface NotificationDetailsModalProps {
  notificationId: string | null
  onOpenChange: (open: boolean) => void
  onMarkAsRead: (notificationId: string) => void
}

export function VenueNotificationDetailsModal({
  notificationId,
  onOpenChange,
  onMarkAsRead,
}: NotificationDetailsModalProps) {
  const isOpen = !!notificationId

  const handleOpenChange = (open: boolean) => {
    if (!open && notificationId) {
      onMarkAsRead(notificationId)
    }
    onOpenChange(open)
  }

  const { data: notification, isLoading } = useGetNotificationByIdQuery(
    notificationId || "",
    {
      skip: !notificationId,
    }
  )

  useEffect(() => {
    if (notificationId && notification && !notification.isRead) {
      onMarkAsRead(notificationId)
    }
  }, [notificationId, notification, onMarkAsRead])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Notification Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : notification ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Message:</p>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Type:</span>
                    <Badge variant="outline">
                      {notification.title || "General"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <Badge variant={notification.isRead ? "outline" : "default"}>
                      {notification.isRead ? "Read" : "Unread"}
                    </Badge>
                  </div>
                </div>
                {notification && Object.keys(notification).length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-medium">Details</h4>
                    <div className="rounded-md bg-muted/50 p-3">
                      <pre className="overflow-x-auto text-sm">
                        {JSON.stringify(notification, null, 2)}
                      </pre>
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
      </DialogContent>
    </Dialog>
  )
}
