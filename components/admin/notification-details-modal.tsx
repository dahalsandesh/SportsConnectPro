import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import { useGetAdminNotificationByIdQuery } from "@/redux/api/admin/notificationsApi"

type NotificationDetails = {
  NotificationID: string
  Message: string
  IsRead: boolean
  CreatedAt: string
  User_id: string
  Date: string
  UpdatedAt: string
}

interface NotificationDetailsModalProps {
  notificationId: string | null
  onOpenChange: (open: boolean) => void
}

export function NotificationDetailsModal({
  notificationId,
  onOpenChange,
}: NotificationDetailsModalProps) {
  const isOpen = !!notificationId

  const { data: notification, isLoading, isFetching } = useGetAdminNotificationByIdQuery(
    notificationId ? { notificationId } : skipToken,
    { skip: !notificationId }
  )



  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {notification.Message}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Date:</span>{' '}
                    {format(new Date(notification.Date), 'PPP')}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={notification.IsRead ? 'text-green-500' : 'text-amber-500'}>
                      {notification.IsRead ? 'Read' : 'Unread'}
                    </span>
                  </p>
                </div>
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
