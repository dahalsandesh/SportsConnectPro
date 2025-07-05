import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import { useGetNotificationByIdQuery } from "@/redux/api/venue-owner/notificationsApi"

type VenueNotification = {
  notificationId: string
  message: string
  isRead: boolean
  createdAt: string
  updatedAt: string
  userId: string
  type?: string
  metadata?: Record<string, any>
}

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

  const { data: notification, isLoading, isFetching } = useGetNotificationByIdQuery(
    notificationId || skipToken,
    { skip: !notificationId }
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
            {isLoading || isFetching ? (
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
                {notification.type && (
                  <div className="space-y-2">
                    <p className="font-medium">Type:</p>
                    <p className="text-muted-foreground capitalize">
                      {notification.type.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Date:</span>{' '}
                    {format(new Date(notification.createdAt), 'PPPp')}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={notification.isRead ? 'text-green-500' : 'text-amber-500'}>
                      {notification.isRead ? 'Read' : 'Unread'}
                    </span>
                  </p>
                </div>
                {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium">Details:</p>
                    <div className="rounded-md bg-muted/50 p-3">
                      <pre className="overflow-x-auto text-sm">
                        {JSON.stringify(notification.metadata, null, 2)}
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
