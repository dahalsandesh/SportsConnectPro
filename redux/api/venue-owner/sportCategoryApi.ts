import { baseApi } from "../baseApi";
import type { ApiResponse } from '@/types/api';

export interface SportCategory {
  sportCategoryId: string;
  sportCategory: string;
}

export const sportCategoryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSportCategories: builder.query<SportCategory[], void>({ // Removed ApiResponse since the endpoint returns array directly
      query: () => "/web/api/v1/venue/GetSportCategory",
      providesTags: ['SportCategories'],
      // Add error handling
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Sport categories fetched successfully:', data);
        } catch (error) {
          console.error('Error fetching sport categories:', error);
        }
      },
    }),
  }),
});

export const { useGetSportCategoriesQuery } = sportCategoryApi;
