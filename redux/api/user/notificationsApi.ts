import { baseApi } from "../baseApi"
import type { 
  ApiResponse, 
  Notification, 
  MarkAsReadRequest,
  NotificationQueryParams
} from "@/types/api"

// Define the tag type for this API
type NotificationTag = { type: 'Notifications', id: string | 'LIST' | 'UNREAD_COUNT' }

// Helper type for tag arrays
type TagArray<T> = Array<T | { type: T; id: string | number }>

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get notifications with filters
    getNotifications: builder.query<Notification[], NotificationQueryParams | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/web/api/v1/notifications",
          params: {
            limit: 10,
            ...queryParams,
          } as Record<string, any>,
        };
      },
      providesTags: (result = []): TagArray<'Notifications'> => [
        { type: 'Notifications', id: 'LIST' },
        ...(result?.map<NotificationTag>(({ id }) => ({ type: 'Notifications', id: String(id) })) || []),
      ],
    }),

    // Get unread notifications count
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => "/web/api/v1/notifications/unread-count",
      providesTags: (): TagArray<'Notifications'> => [
        { type: 'Notifications', id: 'UNREAD_COUNT' }
      ],
    }),

    // Mark notification as read
    markAsRead: builder.mutation<ApiResponse<Notification>, MarkAsReadRequest & { id: string }>({
      query: ({ id }) => ({
        url: `/web/api/v1/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }): TagArray<'Notifications'> => [
        { type: 'Notifications', id: String(id) },
        { type: 'Notifications', id: 'LIST' },
        { type: 'Notifications', id: 'UNREAD_COUNT' },
      ],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation<ApiResponse<{ count: number }>, void>({
      query: () => ({
        url: "/web/api/v1/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: (): TagArray<'Notifications'> => [
        { type: 'Notifications', id: 'LIST' },
        { type: 'Notifications', id: 'UNREAD_COUNT' },
      ],
    }),

    // Delete a notification
    deleteNotification: builder.mutation<ApiResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/web/api/v1/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }): TagArray<'Notifications'> => [
        { type: 'Notifications', id: String(id) },
        { type: 'Notifications', id: 'LIST' },
        { type: 'Notifications', id: 'UNREAD_COUNT' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi

// Export endpoints for use in other parts of the application
export const notificationsEndpoints = notificationsApi.endpoints
