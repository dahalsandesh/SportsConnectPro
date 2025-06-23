 import { baseApi } from "../baseApi";
import type { ApiResponse } from "@/types/api";

export interface VenuePaymentMethod {
  venueId: string;
  venueName: string;
  status: boolean;
}

export interface PaymentType {
  paymentTypeId: string;
  paymentTypeName: string;
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all venue payment methods
    getVenuePaymentMethods: builder.query<VenuePaymentMethod[], void>({
      query: () => "/web/api/v1/adminapp/GetVenuePaymentMethodData",
      providesTags: ["VenuePaymentMethods"],
    }),

    // Get all payment types
    getPaymentTypes: builder.query<PaymentType[], void>({
      query: () => "/web/api/v1/adminapp/GetAllPaymentType",
      providesTags: ["PaymentTypes"],
    }),

    // Get payment type by ID
    getPaymentTypeById: builder.query<PaymentType, string>({
      query: (paymentTypeId) => 
        `/web/api/v1/adminapp/GetPaymentTypeById?paymentTypeId=${paymentTypeId}`,
      providesTags: (result, error, id) => [{ type: "PaymentTypes", id }],
    }),

    // Create payment type
    createPaymentType: builder.mutation<ApiResponse<PaymentType>, { paymentTypeName: string }>({
      query: (body) => ({
        url: "/web/api/v1/adminapp/CreatePaymentType",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentTypes"],
    }),

    // Delete payment type
    deletePaymentType: builder.mutation<ApiResponse<void>, { paymentTypeId: string }>({
      query: (body) => ({
        url: "/web/api/v1/adminapp/DelPaymentType",
        method: "POST",
        body: { paymentTypeId: body.paymentTypeId },
      }),
      invalidatesTags: ["PaymentTypes"],
    }),
  }),
});

export const {
  useGetVenuePaymentMethodsQuery,
  useGetPaymentTypesQuery,
  useGetPaymentTypeByIdQuery,
  useCreatePaymentTypeMutation,
  useDeletePaymentTypeMutation,
} = paymentsApi;