import { baseApi } from "../baseApi";
import type { ApiResponse, CreateUserTypeRequest, DeleteUserTypeRequest, UserType } from "@/types/api";

export const userTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTypes: builder.query<UserType[], void>({
      query: () => "/web/api/v1/adminapp/GetAllUserType",
      providesTags: ["UserTypes"],
    }),

    getUserTypeById: builder.query<UserType, string>({
      query: (userTypeId) => ({
        url: "/web/api/v1/adminapp/GetUserTypeById",
        params: { userTypeId },
      }),
      providesTags: (result, error, id) => [{ type: "UserTypes", id }],
    }),

    createUserType: builder.mutation<ApiResponse<null>, CreateUserTypeRequest>({
      query: (data) => ({
        url: "http://127.0.0.1:8000/web/api/v1/adminapp/CreateUserType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserTypes"],
    }),

    deleteUserType: builder.mutation<ApiResponse<null>, DeleteUserTypeRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelUserType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserTypes"],
    }),
  }),
});

export const { useGetUserTypesQuery, useGetUserTypeByIdQuery, useCreateUserTypeMutation, useDeleteUserTypeMutation } =
  userTypesApi;
