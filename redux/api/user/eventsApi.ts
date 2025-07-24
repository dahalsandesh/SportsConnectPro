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
      invalidatesTags: [{ type: 'RegisteredEvents', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRegisteredEventsQuery,
  useRegisterForEventMutation,
} = userEventsApi;

export default userEventsApi;
