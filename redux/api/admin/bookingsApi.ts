import { baseApi } from "../baseApi";
import type { ApiResponse, Booking } from "@/types/api";

export const adminBookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query<Booking[], { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/web/api/v1/adminapp/GetAllBookings",
        params: { page, limit },
      }),
      providesTags: ["Bookings"],
    }),
    getBookingsByDate: builder.query<any[], { date: string }>({
      query: ({ date }) => ({
        url: "/web/api/v1/adminapp/GetBooking",
        params: { date },
      }),
      providesTags: ["Bookings"],
    }),
    // Add more endpoints as needed
  }),
});

export const { useGetAllBookingsQuery, useGetBookingsByDateQuery } = adminBookingsApi; 