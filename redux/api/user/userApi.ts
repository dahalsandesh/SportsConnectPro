import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/constants';
import type { RootState } from '../../store';

declare module '@/redux/store' {
  export interface RootState {
    auth: {
      token: string | null;
      user: {
        userId: string;
        fullName: string;
        userName: string;
        email: string;
      } | null;
    };
  }
}
import { 
  Booking, 
  DashboardStats, 
  Notification, 
  NotificationsResponse 
} from '@/types/user-dashboard';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Bookings', 'Dashboard', 'Notifications'],
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], { userId: string }>({
      query: ({ userId }) => {
        console.log('Fetching bookings for user:', userId);
        return {
          url: API_ENDPOINTS.USER.BOOKINGS,
          params: { userId },
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      transformResponse: (response: any) => {
        console.log('Bookings response:', response);
        // Return the response directly as it's already an array of bookings
        return Array.isArray(response) ? response : [];
      },
      providesTags: ['Bookings'],
    }),
    getDashboardStats: builder.query<DashboardStats, { userId: string }>({
      query: ({ userId }) => {
        console.log('Fetching dashboard stats for user:', userId);
        return {
          url: API_ENDPOINTS.USER.DASHBOARD_STATS,
          params: { userId },
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      transformResponse: (response: any) => {
        console.log('Dashboard stats response:', response);
        // Return the response directly as it contains the stats object
        return response || {};
      },
      providesTags: ['Dashboard'],
    }),
    getNotifications: builder.query<NotificationsResponse, { userId: string }>({
      query: ({ userId }) => ({
        url: API_ENDPOINTS.USER.NOTIFICATIONS,
        params: { userId },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: any) => {
        // Transform the response to match the expected format
        if (Array.isArray(response)) {
          return {
            notifications: response,
            count: response.filter((n: any) => !n.IsRead).length
          };
        }
        return { notifications: [], count: 0 };
      },
      providesTags: ['Notifications'],
    }),
    getNotificationById: builder.query<Notification, string>({
      query: (notificationId) => ({
        url: `${API_ENDPOINTS.USER.MARK_NOTIFICATION_READ}?notificationId=${notificationId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: any) => response?.data || null,
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetDashboardStatsQuery,
  useGetNotificationsQuery,

} = userApi;
