import { baseApi } from "../baseApi";
import type { ApiResponse, CreateStatusRequest, DeleteStatusRequest, Status } from "@/types/api";

export const statusesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStatuses: builder.query<Status[], void>({
      query: () => "/web/api/v1/adminapp/GetAllStatus",
      providesTags: ["Statuses"],
    }),

    getStatusById: builder.query<Status, string>({
      query: (statusId) => ({
        url: "/web/api/v1/adminapp/GetStatusById",
        params: { statusId },
      }),
      providesTags: (result, error, id) => [{ type: "Statuses", id }],
    }),

    createStatus: builder.mutation<ApiResponse<null>, CreateStatusRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/CreateStatus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Statuses"],
    }),

    deleteStatus: builder.mutation<ApiResponse<null>, DeleteStatusRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelStatus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Statuses"],
    }),
  }),
});

export const { useGetStatusesQuery, useGetStatusByIdQuery, useCreateStatusMutation, useDeleteStatusMutation } =
  statusesApi;
