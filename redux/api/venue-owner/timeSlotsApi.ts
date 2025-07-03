import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface TimeSlot {
  id: number
  startTime: string
  endTime: string
  isAvailable: boolean
  price: number
  courtId: number
  date: string
}

export interface CreateTimeSlotRequest {
  startTime: string
  endTime: string
  price: number
  courtId: number
  date: string
}

export interface UpdateTimeSlotRequest {
  id: number
  startTime?: string
  endTime?: string
  price?: number
  isAvailable?: boolean
}

export const timeSlotsApi = createApi({
  reducerPath: "timeSlotsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/venue-owner/time-slots`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["TimeSlot"],
  endpoints: (builder) => ({
    getTimeSlots: builder.query<TimeSlot[], { courtId?: number; date?: string }>({
      query: (params) => ({
        url: "",
        params,
      }),
      providesTags: ["TimeSlot"],
    }),
    createTimeSlot: builder.mutation<TimeSlot, CreateTimeSlotRequest>({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TimeSlot"],
    }),
    updateTimeSlot: builder.mutation<TimeSlot, UpdateTimeSlotRequest>({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["TimeSlot"],
    }),
    deleteTimeSlot: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TimeSlot"],
    }),
  }),
})

export const { useGetTimeSlotsQuery, useCreateTimeSlotMutation, useUpdateTimeSlotMutation, useDeleteTimeSlotMutation } =
  timeSlotsApi
