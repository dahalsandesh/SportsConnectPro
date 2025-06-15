// Types for Venue Owner Booking and Notification Endpoints

export interface VenueBooking {
  bookingId: string;
  BookerName: string;
  status: string;
  paymentMethod: string;
  totalPrice: number | null;
  bookDate: string;
  timeSlot?: string;
  startTime?: string;
  endTime?: string;
}

export interface UpdateVenueBookingStatusRequest {
  statusId: string;
  bookingId: string;
}

export interface VenueNotification {
  notificationId: string;
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
  [key: string]: any;
}

export interface VenueNotificationsResponse {
  count: number;
  notifications: VenueNotification[];
}
