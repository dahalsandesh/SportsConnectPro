import { baseApi } from "../baseApi"
import type {
  ApiResponse,
  VenueDetails,
  UpdateVenueDetailsRequest,
  VenueImage,
  VenueDashboardData,
  City,
} from "@/types/api"

export const venueApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getVenueDetails: builder.query<VenueDetails, { userId: string }>({
      query: ({ userId }) => {
        if (!userId) {
          throw new Error("User ID is required to fetch venue details")
        }
        return {
          url: "/web/api/v1/venue/GetVenueDetails",
          method: "GET",
          params: { userId },
          headers: {
            Accept: "application/json",
          },
        }
      },
      providesTags: (result) => (result ? [{ type: "Venues" as const, id: result.venueId }] : ["Venues"]),
    }),
    updateVenueDetails: builder.mutation<ApiResponse<null>, UpdateVenueDetailsRequest>({
      query: (data) => {
        const formData = new FormData()

        // Append all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value))
          }
        })

        return {
          url: "/web/api/v1/venue/UpdateVenueDetails",
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      },
      invalidatesTags: (result, error, { venueId }) => [
        { type: "Venues", id: venueId },
        { type: "Venues", id: "LIST" },
        { type: "VenueImages", id: venueId },
        { type: "VenueImages", id: "LIST" },
      ],
    }),
    uploadVenueImage: builder.mutation<
      ApiResponse<{ imageUrl: string }>,
      { venueId: string; file: File; userId: string }
    >({
      query: ({ venueId, file, userId }) => {
        const formData = new FormData()
        formData.append("venueId", venueId)
        formData.append("userId", userId)
        formData.append("image", file)

        return {
          url: "/web/api/v1/venue/UploadVenueImage",
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      },
      invalidatesTags: (result, error, { venueId }) => [
        { type: "Venues", id: venueId },
        { type: "VenueImages", id: "LIST" },
        { type: "VenueImages", id: venueId },
      ],
    }),
    deleteVenueImage: builder.mutation<ApiResponse<null>, { imageId: string; userId: string }>({
      query: ({ imageId, userId }) => {
        const formData = new FormData()
        formData.append("imageId", imageId)
        formData.append("userId", userId)

        return {
          url: "/web/api/v1/venue/DeleteVenueImage",
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      },
      invalidatesTags: (result, error, { imageId }) => [
        { type: "VenueImages", id: imageId },
        { type: "Venues", id: "LIST" },
      ],
    }),
    getVenueDashboardData: builder.query<VenueDashboardData, { userId: string }>({
      query: ({ userId }) => ({
        url: "/web/api/v1/venue/GetDashboardData",
        params: { userId },
      }),
      providesTags: ["Dashboard"],
    }),
    getVenues: builder.query<VenueDetails[], { userId: string }>({
      query: ({ userId }) => ({
        url: `/web/api/v1/venue/GetVenueDetails`,
        params: { userId },
      }),
      providesTags: (result) => {
        if (!Array.isArray(result)) {
          return [{ type: "Venues" as const, id: "LIST" }]
        }

        const venueTags = result
          .filter((venue) => venue?.venueId)
          .map((venue) => ({
            type: "Venues" as const,
            id: venue.venueId,
          }))

        return [...venueTags, { type: "Venues" as const, id: "LIST" }]
      },
    }),
    getVenueImages: builder.query<VenueImage[], { venueId: string; userId: string }>({
      query: ({ venueId, userId }) => ({
        url: `/web/api/v1/venue/GetVenueImages`,
        params: { venueId, userId },
      }),
      providesTags: (result) => {
        if (!Array.isArray(result)) {
          return [{ type: "VenueImages" as const, id: "LIST" }]
        }

        const imageTags = result
          .filter((image) => image?.imageId)
          .map((image) => ({
            type: "VenueImages" as const,
            id: image.imageId,
          }))

        return [...imageTags, { type: "VenueImages" as const, id: "LIST" }]
      },
    }),
  }),
})

export const {
  useGetVenueDetailsQuery,
  useUpdateVenueDetailsMutation,
  useUploadVenueImageMutation,
  useDeleteVenueImageMutation,
  useGetVenueDashboardDataQuery,
  useGetVenuesQuery,
  useGetVenueImagesQuery,
  useLazyGetVenueImagesQuery,
} = venueApi

// Add cities API endpoint
export const citiesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => ({
        url: "/web/api/v1/venue/GetAllCities",
        method: "GET",
      }),
      providesTags: (result) => {
        if (!Array.isArray(result)) {
          return [{ type: "Cities" as const, id: "LIST" }]
        }

        const cityTags = result
          .filter((city) => city?.id)
          .map((city) => ({
            type: "Cities" as const,
            id: city.id,
          }))

        return [...cityTags, { type: "Cities" as const, id: "LIST" }]
      },
    }),
  }),
})

export const { useGetCitiesQuery } = citiesApi
