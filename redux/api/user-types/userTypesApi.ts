import { baseApi } from "../baseApi"

export interface UserType {
  userTypeId: string
  userType: string
}

export const userTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserTypes: builder.query<UserType[], void>({
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

    createUserType: builder.mutation<{ message: string }, { userType: string }>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/CreateUserType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserTypes"],
    }),

    deleteUserType: builder.mutation<{ message: string }, { userTypeId: string }>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelUserType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserTypes"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAllUserTypesQuery,
  useGetUserTypeByIdQuery,
  useCreateUserTypeMutation,
  useDeleteUserTypeMutation,
} = userTypesApi
