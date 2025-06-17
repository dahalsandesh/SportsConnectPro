import { baseApi } from "../baseApi";
import type { VenueNotificationsResponse, VenueNotification } from '@/types/api';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<VenueNotification[], void>({
      query: () => "/web/api/v1/venue/GetNotification",
      providesTags: (result) =>
        result
          ? [...result.map(({ notificationId }) => ({ type: 'Notifications' as const, id: notificationId })), { type: 'Notifications', id: 'LIST' }]
          : [{ type: 'Notifications', id: 'LIST' }],
    }),
    getNotificationById: builder.query<VenueNotification, string>({
      query: (notificationId) => ({
        url: "/web/api/v1/venue/GetNotificationById",
        params: { notificationId },
      }),
      providesTags: (result, error, id) => [{ type: 'Notifications', id }],
    }),
    markAsRead: builder.mutation<{ success: boolean }, string>({
      query: (notificationId) => ({
        url: "/web/api/v1/venue/MarkNotificationAsRead",
        method: 'POST',
        body: { notificationId },
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notifications', id: notificationId },
        { type: 'Notifications', id: 'LIST' },
      ],
    }),
    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (notificationId) => ({
        url: "/web/api/v1/venue/DeleteNotification",
        method: 'POST',
        body: { notificationId },
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notifications', id: notificationId },
        { type: 'Notifications', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
