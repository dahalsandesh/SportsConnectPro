import { baseApi } from "../baseApi";
import type { AdminNotificationsResponse, AdminNotification } from '@/types/api';

export const notificationsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    markNotificationAsRead: builder.mutation<{ success: boolean }, { notificationId: string }>({
      query: ({ notificationId }) => ({
        url: `/web/api/v1/adminapp/GetNotificationById?notificationId=${notificationId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { notificationId }) => [
        { type: 'AdminNotifications', id: notificationId },
        { type: 'AdminNotifications', id: 'LIST' },
      ],
    }),
    getAdminNotifications: builder.query<AdminNotificationsResponse, { userId?: string } | undefined>({
      query: (params) => ({
        url: "/web/api/v1/adminapp/GetNotification",
        ...(params?.userId && { params: { userId: params.userId } })
      }),
      providesTags: (result) =>
        result && result.notifications
          ? [...result.notifications.map(({ id }) => ({ type: 'AdminNotifications' as const, id })), { type: 'AdminNotifications', id: 'LIST' }]
          : [{ type: 'AdminNotifications', id: 'LIST' }],
    }),
    getAdminNotificationById: builder.query<AdminNotification, { notificationId: string }>({
      query: ({ notificationId }) => ({
        url: "/web/api/v1/adminapp/GetNotificationById",
        params: { notificationId }
      }),
      providesTags: (result, error, { notificationId }) => [{ type: 'AdminNotifications', id: notificationId }],
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetAdminNotificationsQuery, 
  useGetAdminNotificationByIdQuery,
  useLazyGetAdminNotificationByIdQuery,
  useMarkNotificationAsReadMutation
} = notificationsApi;
