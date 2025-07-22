import { Notification } from '@/types/user-dashboard';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarkNotificationAsReadMutation } from '@/redux/api/user/userApi';
import { cn } from '@/lib/utils';

export function NotificationsList({ notifications }: { notifications: Notification[] }) {
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({ notificationId }).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.IsRead);
    await Promise.all(
      unreadNotifications.map(notification => 
        markAsRead({ notificationId: notification.NotificationID }).unwrap()
      )
    );
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground text-sm">No notifications yet</p>
        <p className="text-xs text-muted-foreground mt-1">We'll notify you when there's something new</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <div 
          key={notification.NotificationID}
          className={cn(
            "p-4 rounded-lg border",
            !notification.IsRead && "bg-blue-50 dark:bg-blue-900/20"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium">{notification.Message}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.CreatedAt), { addSuffix: true })}
              </p>
            </div>
            {!notification.IsRead && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleMarkAsRead(notification.NotificationID)}
              >
                <Check className="h-3.5 w-3.5" />
                <span className="sr-only">Mark as read</span>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
