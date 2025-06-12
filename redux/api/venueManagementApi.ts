import { baseApi } from "./baseApi"
import type { ApiResponse } from "@/types/api"

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
      query: () => "/web/api/v1/venue/GetCounrt",
      providesTags: ["Courts"],
    }),

    getCourtById: builder.query<Court, string>({
      query: (courtId) => ({
        url: "/web/api/v1/venue/GetCounrtById",
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
  useCreateVenuePostMutation,
  useGetVenuePostsQuery,
  useGetVenuePostDetailsQuery,
  useUpdateVenuePostMutation,
  useDeleteVenuePostMutation,
} = venueManagementApi
