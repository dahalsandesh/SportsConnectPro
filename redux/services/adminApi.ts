import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

// Define our base API URL from environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

// Define types for the API responses
type DashboardData = {}

type UserTypeResponse = {}

type CityResponse = {}

type PaymentTypeResponse = {}

type StatusResponse = {}

type SportCategoryResponse = {}

type GenderResponse = {}

type VenueResponse = {}

type VenueDetailResponse = {}

type VenueApplicationResponse = {}

type VenueApplicationDetailResponse = {}

type PostResponse = {}

type CreateVenueRequest = {}

type UpdateVenueStatusRequest = {}

type UpdatePostRequest = {}

type SportCategoryResponse = {}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/web/api/v1/adminapp/v1`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from state
      const token = (getState() as RootState).auth.token

      // If token exists, add authorization header
      if (token) {
        headers.set("Authorization", `token ${token}`)
      }

      return headers
    },
  }),
  tagTypes: [
    "Dashboard",
    "Users",
    "Venues",
    "VenueApplications",
    "Posts",
    "Cities",
    "PaymentTypes",
    "Statuses",
    "SportCategories",
    "Genders",
  ],
  endpoints: (builder) => ({
    // Dashboard
    getDashboardData: builder.query<DashboardData, void>({
      query: () => "/DashboardData",
      providesTags: ["Dashboard"],
    }),

    // User Types
    getAllUserTypes: builder.query<UserTypeResponse[], void>({
      query: () => "/GetAllUserType",
      providesTags: ["Users"],
    }),
    getUserTypeById: builder.query<UserTypeResponse, string>({
      query: (userTypeId) => `/GetUserTypeById?userTypeId=${userTypeId}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    createUserType: builder.mutation<{ message: string }, { userType: string }>({
      query: (data) => ({
        url: "/CreateUserType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUserType: builder.mutation<{ message: string }, { userTypeId: string }>({
      query: (data) => ({
        url: "/DelUserType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // Cities
    getAllCities: builder.query<CityResponse[], void>({
      query: () => "/GetAllCity",
      providesTags: ["Cities"],
    }),
    getCityById: builder.query<CityResponse, string>({
      query: (cityId) => `/GetCityById?cityId=${cityId}`,
      providesTags: (result, error, id) => [{ type: "Cities", id }],
    }),
    createCity: builder.mutation<{ message: string }, { cityName: string }>({
      query: (data) => ({
        url: "/CreateCity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),
    deleteCity: builder.mutation<{ message: string }, { cityId: string }>({
      query: (data) => ({
        url: "/DelCity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),

    // Payment Types
    getAllPaymentTypes: builder.query<PaymentTypeResponse[], void>({
      query: () => "/GetAllPaymentType",
      providesTags: ["PaymentTypes"],
    }),
    getPaymentTypeById: builder.query<PaymentTypeResponse, string>({
      query: (paymentTypeId) => `/GetPaymentTypeById?paymentTypeId=${paymentTypeId}`,
      providesTags: (result, error, id) => [{ type: "PaymentTypes", id }],
    }),
    createPaymentType: builder.mutation<{ message: string }, { paymentTypeName: string }>({
      query: (data) => ({
        url: "/CreatePaymentType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentTypes"],
    }),
    deletePaymentType: builder.mutation<{ message: string }, { paymentTypeId: string }>({
      query: (data) => ({
        url: "/DelPaymentType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentTypes"],
    }),

    // Statuses
    getAllStatuses: builder.query<StatusResponse[], void>({
      query: () => "/GetAllStatus",
      providesTags: ["Statuses"],
    }),
    getStatusById: builder.query<StatusResponse, string>({
      query: (statusId) => `/GetStatusById?statusId=${statusId}`,
      providesTags: (result, error, id) => [{ type: "Statuses", id }],
    }),
    createStatus: builder.mutation<{ message: string }, { status: string }>({
      query: (data) => ({
        url: "/CreateStatus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Statuses"],
    }),
    deleteStatus: builder.mutation<{ message: string }, { statusId: string }>({
      query: (data) => ({
        url: "/DelStatus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Statuses"],
    }),

    // Sport Categories
    getAllSportCategories: builder.query<SportCategoryResponse[], void>({
      query: () => "/GetAllSportCategory",
      providesTags: ["SportCategories"],
    }),
    getSportCategoryById: builder.query<SportCategoryResponse, string>({
      query: (sportCategoryId) => `/GetSportCategoryById?sportCategoryId=${sportCategoryId}`,
      providesTags: (result, error, id) => [{ type: "SportCategories", id }],
    }),
    createSportCategory: builder.mutation<{ message: string }, { sportCategory: string }>({
      query: (data) => ({
        url: "/CreateSportCategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SportCategories"],
    }),
    deleteSportCategory: builder.mutation<{ message: string }, { sportCategoryId: string }>({
      query: (data) => ({
        url: "/DelSportCategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SportCategories"],
    }),

    // Genders
    getAllGenders: builder.query<GenderResponse[], void>({
      query: () => "/GetAllGender",
      providesTags: ["Genders"],
    }),
    getGenderById: builder.query<GenderResponse, string>({
      query: (genderId) => `/GetGenderById?genderId=${genderId}`,
      providesTags: (result, error, id) => [{ type: "Genders", id }],
    }),
    createGender: builder.mutation<{ message: string }, { gender: string }>({
      query: (data) => ({
        url: "/CreateGender",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Genders"],
    }),
    deleteGender: builder.mutation<{ message: string }, { genderId: string }>({
      query: (data) => ({
        url: "/DelGender",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Genders"],
    }),

    // Venues
    getAllVenues: builder.query<VenueResponse[], void>({
      query: () => "/GetVenue",
      providesTags: ["Venues"],
    }),
    getVenueDetails: builder.query<VenueDetailResponse, string>({
      query: (venueId) => `/GetVenueDetails?venueId=${venueId}`,
      providesTags: (result, error, id) => [{ type: "Venues", id }],
    }),
    createVenue: builder.mutation<{ message: string }, CreateVenueRequest>({
      query: (data) => ({
        url: "/CreateVenue",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Venues"],
    }),
    updateVenueStatus: builder.mutation<{ message: string }, UpdateVenueStatusRequest>({
      query: (data) => ({
        url: "/UpdateVenueStatus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Venues"],
    }),

    // Venue Applications
    getAllVenueApplications: builder.query<VenueApplicationResponse[], void>({
      query: () => "/GetVenueApplication",
      providesTags: ["VenueApplications"],
    }),
    getVenueApplicationById: builder.query<VenueApplicationDetailResponse, string>({
      query: (applicationId) => `/GetVenueApplicationById?applicationId=${applicationId}`,
      providesTags: (result, error, id) => [{ type: "VenueApplications", id }],
    }),

    // Posts (News & Media)
    getAllPosts: builder.query<PostResponse[], string | void>({
      query: (userId) => (userId ? `/GetPost?userId=${userId}` : "/GetPost"),
      providesTags: ["Posts"],
    }),
    getPostDetails: builder.query<PostResponse, string>({
      query: (postId) => `/GetPostDetails?postId=${postId}`,
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    createPost: builder.mutation<{ message: string }, FormData>({
      query: (data) => ({
        url: "/CreatePost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: builder.mutation<{ message: string }, UpdatePostRequest>({
      query: (data) => ({
        url: "/UpdatePost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),
    deletePost: builder.mutation<{ message: string }, { postId: string }>({
      query: (data) => ({
        url: "/DelPost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
})

export const {
  // Dashboard
  useGetDashboardDataQuery,

  // User Types
  useGetAllUserTypesQuery,
  useGetUserTypeByIdQuery,
  useCreateUserTypeMutation,
  useDeleteUserTypeMutation,

  // Cities
  useGetAllCitiesQuery,
  useGetCityByIdQuery,
  useCreateCityMutation,
  useDeleteCityMutation,

  // Payment Types
  useGetAllPaymentTypesQuery,
  useGetPaymentTypeByIdQuery,
  useCreatePaymentTypeMutation,
  useDeletePaymentTypeMutation,

  // Statuses
  useGetAllStatusesQuery,
  useGetStatusByIdQuery,
  useCreateStatusMutation,
  useDeleteStatusMutation,

  // Sport Categories
  useGetAllSportCategoriesQuery,
  useGetSportCategoryByIdQuery,
  useCreateSportCategoryMutation,
  useDeleteSportCategoryMutation,

  // Genders
  useGetAllGendersQuery,
  useGetGenderByIdQuery,
  useCreateGenderMutation,
  useDeleteGenderMutation,

  // Venues
  useGetAllVenuesQuery,
  useGetVenueDetailsQuery,
  useCreateVenueMutation,
  useUpdateVenueStatusMutation,

  // Venue Applications
  useGetAllVenueApplicationsQuery,
  useGetVenueApplicationByIdQuery,

  // Posts
  useGetAllPostsQuery,
  useGetPostDetailsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = adminApi
