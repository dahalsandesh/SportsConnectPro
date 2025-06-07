import { baseApi } from "../baseApi"
import type { 
  ApiResponse, 
  Payment, 
  PaymentIntentRequest, 
  PaymentIntentResponse,
  ProcessPaymentRequest,
  RefundPaymentRequest,
  PaymentQueryParams
} from "@/types/api"

// Define the tag type for this API
type PaymentTag = { type: 'Payments', id: string | 'LIST' }

// Helper type for tag arrays
type TagArray<T> = Array<T | { type: T; id: string | number }>

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get payment history with filters
    getPayments: builder.query<Payment[], PaymentQueryParams | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/web/api/v1/payments",
          params: queryParams as Record<string, any>,
        };
      },
      providesTags: (result = []): TagArray<'Payments'> => [
        { type: 'Payments', id: 'LIST' },
        ...(result?.map<PaymentTag>(({ id }) => ({ type: 'Payments', id: String(id) })) || []),
      ],
    }),

    // Get payment by ID
    getPaymentById: builder.query<Payment, string>({
      query: (id) => ({
        url: `/web/api/v1/payments/${id}`,
      }),
      providesTags: (result, error, id): TagArray<'Payments'> => [
        { type: 'Payments', id: String(id) }
      ],
    }),

    // Create a payment intent
    createPaymentIntent: builder.mutation<PaymentIntentResponse, PaymentIntentRequest>({
      query: (data) => ({
        url: "/web/api/v1/payments/create-payment-intent",
        method: "POST",
        body: data,
      }),
    }),

    // Process a payment
    processPayment: builder.mutation<ApiResponse<Payment>, ProcessPaymentRequest>({
      query: (data) => ({
        url: "/web/api/v1/payments/process",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (): TagArray<'Payments'> => [
        { type: 'Payments', id: 'LIST' }
      ],
    }),

    // Refund a payment
    refundPayment: builder.mutation<ApiResponse<Payment>, RefundPaymentRequest & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `/web/api/v1/payments/${id}/refund`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }): TagArray<'Payments'> => [
        { type: 'Payments', id: String(id) },
        { type: 'Payments', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentIntentMutation,
  useProcessPaymentMutation,
  useRefundPaymentMutation,
} = paymentsApi

// Export endpoints for use in other parts of the application
export const paymentsEndpoints = paymentsApi.endpoints
