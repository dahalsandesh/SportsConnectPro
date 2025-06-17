import { baseApi } from "../baseApi";
import type { ApiResponse, CreateSportCategoryRequest, DeleteSportCategoryRequest, SportCategory } from "@/types/api";

export const sportCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSportCategories: builder.query<SportCategory[], void>({
      query: () => "/web/api/v1/adminapp/GetAllSportCategory",
      providesTags: ["SportCategories"],
    }),

    getSportCategoryById: builder.query<SportCategory, string>({
      query: (sportCategoryId) => ({
        url: "/web/api/v1/adminapp/GetSportCategoryById",
        params: { sportCategoryId },
      }),
      providesTags: (result, error, id) => [{ type: "SportCategories", id }],
    }),

    createSportCategory: builder.mutation<ApiResponse<null>, CreateSportCategoryRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/CreateSportCategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SportCategories"],
    }),

    deleteSportCategory: builder.mutation<ApiResponse<null>, DeleteSportCategoryRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelSportCategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SportCategories"],
    }),
  }),
});

export const {
  useGetSportCategoriesQuery,
  useGetSportCategoryByIdQuery,
  useCreateSportCategoryMutation,
  useDeleteSportCategoryMutation,
} = sportCategoriesApi;
