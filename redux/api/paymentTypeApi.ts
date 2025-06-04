import { baseApi } from "./baseApi"
import type { ApiResponse, CreatePaymentTypeRequest, DeletePaymentTypeRequest, PaymentType } from "@/types/api"

export const paymentTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentTypes: builder.query<PaymentType[], void>({
      query: () => "/web/api/v1/adminapp/v1/GetAllPaymentType",
      providesTags: ["PaymentTypes"],
    }),

    getPaymentTypeById: builder.query<PaymentType, string>({
      query: (paymentTypeId) => ({
        url: "/web/api/v1/adminapp/GetPaymentTypeById",
        params: { paymentTypeId },
      }),
      providesTags: (result, error, id) => [{ type: "PaymentTypes", id }],
    }),

    createPaymentType: builder.mutation<ApiResponse<null>, CreatePaymentTypeRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/CreatePaymentType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentTypes"],
    }),

    deletePaymentType: builder.mutation<ApiResponse<null>, DeletePaymentTypeRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelPaymentType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentTypes"],
    }),
  }),
})

export const {
  useGetPaymentTypesQuery,
  useGetPaymentTypeByIdQuery,
  useCreatePaymentTypeMutation,
  useDeletePaymentTypeMutation,
} = paymentTypeApi
