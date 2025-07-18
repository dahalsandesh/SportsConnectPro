export interface Booking {
  bookingId: string;
  userName: string;
  ticket: string;
  status: 'Pending' | 'Success' | 'Rejected' | 'Cancelled';
  paymentMethod: string;
  price: number;
  bookingDate?: string;
  venueName?: string;
}

export interface DashboardStats {
  booking_count: number;
  booking_pending_count: number;
  booking_reject_count: number;
  booking_success_count: number;
  total_revenue: number;
}

export interface Notification {
  NotificationID: string;
  Message: string;
  User_id: string;
  Date: string;
  IsRead: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface NotificationsResponse {
  count: number;
  notifications: Notification[];
}
