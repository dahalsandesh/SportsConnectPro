import { baseApi } from "./baseApi";
import type { UserType } from "@/types/auth";

export interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  userType: UserType;
  isVerified: boolean;
  createdAt: string;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => "/web/api/v1/adminapp/GetAllUsers",
      providesTags: ["Users"],
    }),
    getUserById: builder.query<User, string>({
      query: (userId) => ({
        url: "/web/api/v1/adminapp/GetUserById",
        params: { userId },
      }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    updateUser: builder.mutation<{ message: string }, Partial<User> & { id: string }>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/UpdateUser",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
    deleteUser: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: "/web/api/v1/adminapp/DeleteUser",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
    blockUser: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: "/web/api/v1/adminapp/BlockUser",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
    unblockUser: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: "/web/api/v1/adminapp/UnblockUser",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} = usersApi;
