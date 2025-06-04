import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"

export interface UserType {
  id: string
  name: string
  description: string
}

export const userTypesApi = createApi({
  reducerPath: "userTypesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/web/api/v1/admin`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("Authorization", `token ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["UserTypes"],
  endpoints: (builder) => ({
    getAllUserTypes: builder.query<UserType[], void>({
      query: () => "user-types",
      providesTags: ["UserTypes"],
    }),

    createUserType: builder.mutation<{ message: string }, { name: string; description: string }>({
      query: (data) => ({
        url: "user-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserTypes"],
    }),

    deleteUserType: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `user-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserTypes"],
    }),
  }),
})

export const {
  useGetAllUserTypesQuery,
  useCreateUserTypeMutation,
  useDeleteUserTypeMutation,
} = userTypesApi
