import { baseApi } from "../baseApi"

export interface Notification {
  NotificationID: string;
  Message: string;
  User_id: string;
  Date: string;
  IsRead: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  Title?: string;
  Link?: string;
}

interface NotificationsResponse {
  count: number;
  notifications: Notification[];
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all notifications with count
    getNotifications: builder.query<NotificationsResponse, { userId: string }>({
      query: ({ userId }) => ({
        url: "/web/api/v1/user/GetNotification",
        params: { userId },
        headers: {
          'Authorization': `token ${localStorage.getItem('token')}`
        }
      }),
      transformResponse: (response: any) => ({
        count: response?.count || 0,
        notifications: response?.notifications?.map((n: any) => ({
          ...n,
          // Map to match the Notification interface
          NotificationID: n.NotificationID,
          IsRead: n.IsRead || false,
          CreatedAt: n.CreatedAt,
          UpdatedAt: n.UpdatedAt || n.CreatedAt,
        })) || []
      }),
      providesTags: ['Notifications'],
    }),

    // Get notification by ID (auto-marks as read)
    getNotificationById: builder.query<Notification, string>({
      query: (notificationId) => ({
        url: "/web/api/v1/user/GetNotificationById",
        params: { notificationId },
      }),
      transformResponse: (response: any) => ({
        ...response,
        IsRead: response?.IsRead || true, // Server marks as read on fetch
      }),
      providesTags: (result, error, id) => [{ type: 'Notifications', id }],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  useGetNotificationsQuery,
  useLazyGetNotificationByIdQuery,
} = notificationsApi;

// Export endpoints for use in other parts of the application
export const notificationsEndpoints = notificationsApi.endpoints;
