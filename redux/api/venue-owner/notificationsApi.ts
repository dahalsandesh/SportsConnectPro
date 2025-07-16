import { baseApi } from "../baseApi";
import type { VenueNotification } from '@/types/api';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<{ count: number; notifications: VenueNotification[] }, { userId?: string } | undefined>({
      query: (params = {}) => ({
        url: "/web/api/v1/venue/GetNotification",
        method: 'GET',
        params: params?.userId ? { userId: params.userId } : {},
        headers: {
          'Accept': 'application/json',
        },
      }),
      transformResponse: (response: { count: number; notifications: any[] }) => ({
        ...response,
        notifications: response.notifications.map(notification => ({
          ...notification,
          notificationId: notification.NotificationID,
          message: notification.Message,
          isRead: notification.IsRead,
          createdAt: notification.CreatedAt
        }))
      }),
      providesTags: (result) =>
        result && result.notifications
          ? [
              ...result.notifications.map(({ notificationId }) => ({ 
                type: 'Notifications' as const, 
                id: notificationId 
              })), 
              { type: 'Notifications', id: 'LIST' }
            ]
          : [{ type: 'Notifications', id: 'LIST' }],
    }),
    getNotificationById: builder.query<VenueNotification, string>({
      query: (notificationId) => ({
        url: "/web/api/v1/venue/GetNotificationById",
        params: { notificationId },
      }),
      providesTags: (result, error, id) => [{ type: 'Notifications', id }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
} = notificationApi;
