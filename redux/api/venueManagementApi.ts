import { baseApi } from "./baseApi"
import type { ApiResponse } from "@/types/api"
import type {
  VenueBooking,
  UpdateVenueBookingStatusRequest,
  VenueNotification,
  VenueNotificationsResponse
} from "@/types/venue-owner-api"

export interface VenueDetails {
  venueId: string
  venueName: string
  address: string
  cityName: string
  latitude: string | null
  longitude: string | null
  phoneNumber: string
  email: string
  desc: string
  openingTime: string | null
  closingTime: string | null
  isActive: boolean
  venueImage: VenueImage[]
}

export interface VenueImage {
  imageId: string
  imageUrl: string
}

export interface UpdateVenueDetailsRequest {
  venueId: string
  venueName: string
  address: string
  cityId: string
  latitude: string | null
  longitude: string | null
  phoneNumber: string
  email: string
  desc: string
  openingTime: string | null
  closingTime: string | null
  isActive: boolean
}

export interface Court {
  courtId: string
  courtName: string
  courtCategory: string
  hourlyRate: number
  capacity: number
  surfaceType: string
  desc: string
  isActive: boolean
}

export interface CreateCourtRequest {
  courtName: string
  courtCategoryId: string
  hourlyRate: string
  capacity: string
  surfaceType: string
  desc: string
}

export interface UpdateCourtRequest extends CreateCourtRequest {
  courtId: string
  isActive: string
}

export interface VenueDashboardData {
  totalBookings: number
  totalRevenue: number
  activeCourts: number
  pendingBookings: number
}

export const venueManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Venue details
    getVenueDetails: builder.query<VenueDetails, void>({
      query: () => "/web/api/v1/venue/GetVenueDetails",
      providesTags: ["Venues"],
    }),

    updateVenueDetails: builder.mutation<ApiResponse<null>, UpdateVenueDetailsRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/UpdateVenueDetails",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Venues"],
    }),

    uploadVenueImage: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/UploadVenueImage",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Venues"],
    }),

    // Court management
    createCourt: builder.mutation<ApiResponse<null>, CreateCourtRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/CreateCourt",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courts"],
    }),

    getCourts: builder.query<Court[], void>({
      query: () => "/web/api/v1/venue/GetCourt",
      providesTags: ["Courts"],
    }),

    getCourtById: builder.query<Court, string>({
      query: (courtId) => ({
        url: "/web/api/v1/venue/GetCourtById",
        params: { courtId },
      }),
      providesTags: (result, error, id) => [{ type: "Courts", id }],
    }),

    updateCourt: builder.mutation<ApiResponse<null>, UpdateCourtRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/UpdateCourt",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courts"],
    }),

    uploadCourtImage: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/UploadCourtImage",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Courts"],
    }),

    // Dashboard
    getVenueDashboardData: builder.query<VenueDashboardData, void>({
      query: () => "/web/api/v1/venue/GetDashboardData",
      providesTags: ["Dashboard"],
    }),

    // Venue Owner Booking APIs
    getVenueBookings: builder.query<VenueBooking[], { courtId: string; startDate: string; endDate: string }>({
      query: ({ courtId, startDate, endDate }) => ({
        url: "/web/api/v1/venue/GetBooking",
        params: { courtId, startDate, endDate },
      }),
      transformResponse: (response: VenueBooking[]) => response,
    }),
    getVenueBookingById: builder.query<VenueBooking, { bookingId: string }>({
      query: ({ bookingId }) => ({
        url: "/web/api/v1/venue/GetBookingById",
        params: { bookingId },
      }),
      transformResponse: (response: VenueBooking) => response,
    }),
    updateVenueBookingStatus: builder.mutation<{ message: string }, UpdateVenueBookingStatusRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/UpdateBookingStatus",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { message: string }) => response,
    }),

    // Venue Owner Notification APIs
    getVenueNotifications: builder.query<VenueNotificationsResponse, void>({
      query: () => ({
        url: "/web/api/v1/venue/GetNotification",
      }),
      transformResponse: (response: VenueNotificationsResponse) => response,
    }),
    getVenueNotificationById: builder.query<VenueNotification, { notificationId: string }>({
      query: ({ notificationId }) => ({
        url: "/web/api/v1/venue/GetNotificationById",
        params: { notificationId },
      }),
      transformResponse: (response: VenueNotification) => response,
    }),

    // News and Media
    createVenuePost: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/CreatePost",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["VenuePosts"],
    }),
    getVenuePosts: builder.query<any[], void>({
      query: () => "/web/api/v1/venue/GetAllPosts",
      providesTags: ["VenuePosts"],
    }),
    getVenuePostDetails: builder.query<any, string>({
      query: (postId) => ({
        url: "/web/api/v1/venue/GetPostDetails",
        params: { postId },
      }),
      providesTags: (result, error, id) => [{ type: "VenuePosts", id }],
    }),
    updateVenuePost: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/UpdatePost",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["VenuePosts"],
    }),
    deleteVenuePost: builder.mutation<ApiResponse<null>, { postId: string }>({
      query: ({ postId }) => ({
        url: "/web/api/v1/venue/DeletePost",
        method: "POST",
        body: { postId },
      }),
      invalidatesTags: ["VenuePosts"],
    }),

    deleteCourt: builder.mutation<ApiResponse<null>, { courtId: string }>({
      query: ({ courtId }) => ({
        url: "/web/api/v1/venue/DeleteCourt",
        method: "POST",
        body: { courtId },
      }),
      invalidatesTags: ["Courts"],
    }),

    // Sports Events
    createSportsEvent: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/CreateEvent",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["SportsEvents"],
    }),
    getSportsEvents: builder.query<any[], { venueId: string }>({
      query: ({ venueId }) => ({
        url: "/web/api/v1/venue/GetEvents",
        params: { venueId },
      }),
      providesTags: ["VenueEvents"],
    }),
    updateSportsEvent: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/UpdateEvent",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["VenueEvents"],
    }),
    deleteSportsEvent: builder.mutation<ApiResponse<null>, { eventId: string }>({
      query: ({ eventId }) => ({
        url: "/web/api/v1/venue/DeleteEvent",
        method: "POST",
        body: { eventId },
      }),
      invalidatesTags: ["VenueEvents"],
    }),

    // Venue Application
    createVenueApplication: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/CreateVenueApplication",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["VenueApplications"],
    }),

    // Venue Images
    getVenueImages: builder.query<VenueImage[], void>({
      query: () => "/web/api/v1/venue/GetVenueImages",
      providesTags: ["VenueImages"],
    }),

    deleteVenueImage: builder.mutation<ApiResponse<null>, { imageId: string }>({
      query: ({ imageId }) => ({
        url: "/web/api/v1/venue/DeleteVenueImage",
        method: "POST",
        body: { imageId },
      }),
      invalidatesTags: ["VenueImages"],
    }),
  }),
})

export const {
  useGetVenueDetailsQuery,
  useUpdateVenueDetailsMutation,
  useUploadVenueImageMutation,
  useCreateCourtMutation,
  useGetCourtsQuery,
  useGetCourtByIdQuery,
  useUpdateCourtMutation,
  useUploadCourtImageMutation,
  useGetVenueDashboardDataQuery,
  useGetVenueBookingsQuery,
  useGetVenueBookingByIdQuery,
  useUpdateVenueBookingStatusMutation,
  useGetVenueNotificationsQuery,
  useGetVenueNotificationByIdQuery,
  useCreateVenuePostMutation,
  useGetVenuePostsQuery,
  useGetVenuePostDetailsQuery,
  useUpdateVenuePostMutation,
  useDeleteVenuePostMutation,
  useDeleteCourtMutation,
  useCreateSportsEventMutation,
  useGetSportsEventsQuery,
  useUpdateSportsEventMutation,
  useDeleteSportsEventMutation,
  useCreateVenueApplicationMutation,
  useGetVenueImagesQuery,
  useDeleteVenueImageMutation,
} = venueManagementApi
