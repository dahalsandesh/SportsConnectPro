import { baseApi } from "./baseApi"
import type { ApiResponse, CreateGenderRequest, DeleteGenderRequest, Gender } from "@/types/api"

export const genderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGenders: builder.query<Gender[], void>({
      query: () => "/web/api/v1/adminapp/v1/GetAllGender",
      providesTags: ["Genders"],
    }),

    getGenderById: builder.query<Gender, string>({
      query: (genderId) => ({
        url: "/web/api/v1/adminapp/v1/GetGenderById",
        params: { genderId },
      }),
      providesTags: (result, error, id) => [{ type: "Genders", id }],
    }),

    createGender: builder.mutation<ApiResponse<null>, CreateGenderRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/v1/CreateGender",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Genders"],
    }),

    deleteGender: builder.mutation<ApiResponse<null>, DeleteGenderRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/v1/DelGender",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Genders"],
    }),
  }),
})

export const { useGetGendersQuery, useGetGenderByIdQuery, useCreateGenderMutation, useDeleteGenderMutation } = genderApi
