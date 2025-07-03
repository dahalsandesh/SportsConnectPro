import { baseApi } from "../baseApi"
import type { VenueNotification } from "@/types/api"

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<{ count: number; notifications: VenueNotification[] }, { userId: string }>({
      query: ({ userId }) => ({
        url: "/web/api/v1/venue/GetNotification",
        params: { userId },
      }),
      providesTags: (result) =>
        result && result.notifications
          ? [
              ...result.notifications.map(({ notificationId }) => ({
                type: "Notifications" as const,
                id: notificationId,
              })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),
    getNotificationById: builder.query<VenueNotification, { notificationId: string; userId: string }>({
      query: ({ notificationId, userId }) => ({
        url: "/web/api/v1/venue/GetNotificationById",
        params: { notificationId, userId },
      }),
      providesTags: (result, error, { notificationId }) => [{ type: "Notifications", id: notificationId }],
    }),
  }),
})

export const { useGetNotificationsQuery, useGetNotificationByIdQuery } = notificationApi
