import { createApi } from '@reduxjs/toolkit/query/react';
import { baseApi } from '../baseApi';
import { 
  GetRegisteredEventsResponse, 
  RegisterForEventRequest, 
  RegisterForEventResponse 
} from '@/types/user-events';

export const userEventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRegisteredEvents: builder.query<GetRegisteredEventsResponse, string>({
      query: (userId) => ({
        url: '/web/api/v1/user/GetRegisteredEvent',
        params: { userId },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'RegisteredEvents' as const, id })),
              { type: 'RegisteredEvents', id: 'LIST' },
            ]
          : [{ type: 'RegisteredEvents', id: 'LIST' }],
    }),
    
    registerForEvent: builder.mutation<RegisterForEventResponse, RegisterForEventRequest>({
      query: (data) => ({
        url: '/web/api/v1/user/RegisteredEvent',
        method: 'POST',
        body: data,
      }),
      // Handle the response and errors directly in the query
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ({
            url: '/web/api/v1/user/RegisteredEvent',
            method: 'POST',
            body: arg,
          });

          if (result.error) {
            // If we have an error, return it directly
            return {
              error: {
                status: result.error.status,
                data: result.error.data || { message: 'Registration failed' },
              },
            };
          }

          return { data: result.data };
        } catch (error: any) {
          // Handle any other errors
          return {
            error: {
              status: error.status || 500,
              data: error.data || { message: error.message || 'Registration failed' },
            },
          };
        }
      },
      // Don't throw errors, let the component handle them
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'Registration failed',
        };
      },
      invalidatesTags: ['RegisteredEvents'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRegisteredEventsQuery,
  useRegisterForEventMutation,
} = userEventsApi;

export default userEventsApi;
