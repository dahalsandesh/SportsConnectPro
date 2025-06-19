import { baseApi } from "../baseApi";
import type { AdminNotificationsResponse, AdminNotification } from '@/types/api';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<AdminNotificationsResponse, void>({
      query: () => "/web/api/v1/adminapp/GetNotification",
      providesTags: (result) =>
        result && result.notifications
          ? [...result.notifications.map(({ id }) => ({ type: 'AdminNotifications' as const, id })), { type: 'AdminNotifications', id: 'LIST' }]
          : [{ type: 'AdminNotifications', id: 'LIST' }],
    }),
    getAdminNotificationById: builder.query<AdminNotification, string>({
      query: (notificationId) => `/web/api/v1/adminapp/GetNotificationById?notificationId=${notificationId}`,
      providesTags: (result, error, id) => [{ type: 'AdminNotifications', id }],
    }),
  }),
});

export const {
    useGetAdminNotificationsQuery,
    useGetAdminNotificationByIdQuery,
} = notificationsApi;
