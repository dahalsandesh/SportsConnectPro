import { baseApi } from "../baseApi";
import type { ApiResponse, Venue, VenueDetails, UpdateVenueDetailsRequest, VenueImage, VenueDashboardData, City } from '@/types/api';

export const venueApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getVenueDetails: builder.query<VenueDetails, { userId: string }>({ 
      query: ({ userId }) => {
        if (!userId) {
          throw new Error('User ID is required to fetch venue details');
        }
        return {
          url: "/web/api/v1/venue/GetVenueDetails",
          method: 'GET',
          params: { userId },
          headers: {
            'Accept': 'application/json',
          },
        };
      },
      providesTags: (result) => 
        result ? [{ type: 'Venues' as const, id: result.id }] : ['Venues'],
    }),
    updateVenueDetails: builder.mutation<ApiResponse<null>, UpdateVenueDetailsRequest>({ 
      query: (data) => {
        const formData = new FormData();
        
        // Append all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        });
        
        return {
          url: '/web/api/v1/venue/UpdateVenueDetails',
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        };
      },
      invalidatesTags: (result, error, { venueId }) => [
        { type: 'Venues', id: venueId },
        { type: 'Venues', id: 'LIST' },
        { type: 'VenueImages', id: venueId },
        { type: 'VenueImages', id: 'LIST' },
      ],
    }),
    uploadVenueImage: builder.mutation<ApiResponse<{ imageUrl: string }>, { userId: string; file: File }>({ 
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('image', file);
        
        return {
          url: '/web/api/v1/venue/UploadVenueImage',
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        };
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Venues', id: 'USER_' + userId },
        { type: 'VenueImages', id: 'LIST' },
        { type: 'VenueImages', id: 'USER_' + userId },
      ],
    }),
    deleteVenueImage: builder.mutation<ApiResponse<null>, { imageId: string; userId: string }>({
      query: ({ imageId, userId }) => {
        const formData = new FormData();
        formData.append('imageId', imageId);
        formData.append('userId', userId);
        
        return {
          url: '/web/api/v1/venue/DeleteVenueImage',
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        };
      },
      invalidatesTags: (result, error, { imageId }) => [
        { type: 'VenueImages', id: imageId },
        { type: 'Venues', id: 'LIST' },
      ],
    }),

    
     getVenueDashboardData: builder.query<VenueDashboardData, { userId: string }>({ 
      query: ({ userId }) => ({
        url: "/web/api/v1/venue/GetDashboardData",
        method: 'GET',
        params: { userId },
        headers: {
          'Accept': 'application/json',
        },
      }),
      providesTags: ["Dashboard"],
    }),


    getVenues: builder.query<VenueDetails[], { userId: string }>({
      query: ({ userId }) => ({
        url: `/web/api/v1/venue/GetVenueDetails`,
        params: { userId },
      }),
      providesTags: (result) => {
        // If result is not an array, return the basic tag
        if (!Array.isArray(result)) {
          return [{ type: 'Venues' as const, id: 'LIST' }];
        }
        
        // Map over the result and include both individual and list tags
        const venueTags = result
          .filter(venue => venue?.id) // Filter out any invalid venues
          .map(venue => ({
            type: 'Venues' as const,
            id: venue.id
          }));
          
        return [...venueTags, { type: 'Venues' as const, id: 'LIST' }];
      },
    }),
    getVenueImages: builder.query<VenueImage[], { venueId: string }>({
      query: ({ venueId }) => ({
        url: `/web/api/v1/venue/GetVenueImages`,
        params: { venueId },
      }),
      providesTags: (result) => {
        // If result is not an array, return the basic tag
        if (!Array.isArray(result)) {
          return [{ type: 'VenueImages' as const, id: 'LIST' }];
        }
        
        // Map over the result and include both individual and list tags
        const imageTags = result
          .filter(image => image?.imageId) // Filter out any invalid images
          .map(image => ({
            type: 'VenueImages' as const,
            id: image.imageId
          }));
          
        return [...imageTags, { type: 'VenueImages' as const, id: 'LIST' }];
      },
    }),
  }),
});

export const {
    useGetVenuesQuery,
    useGetVenueDashboardDataQuery,
    useGetVenueDetailsQuery,
    useUpdateVenueDetailsMutation,
    useUploadVenueImageMutation,
    useDeleteVenueImageMutation,
    useGetVenueImagesQuery,
    useLazyGetVenueImagesQuery,
} = venueApi;

// Add cities API endpoint
export const citiesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCities: builder.query<Array<{ CityID: string; CityName: string }>, void>({
      query: () => ({
        url: '/web/api/v1/venue/GetCity',
        method: 'GET',
      }),
      providesTags: (result) => {
        // If result is not an array, return the basic tag
        if (!Array.isArray(result)) {
          return [{ type: 'Cities' as const, id: 'LIST' }];
        }
        
        // Map over the result and include both individual and list tags
        const cityTags = result
          .filter(city => city?.id) // Filter out any invalid cities
          .map(city => ({
            type: 'Cities' as const,
            id: city.id
          }));
          
        return [...cityTags, { type: 'Cities' as const, id: 'LIST' }];
      },
    }),
  }),
});

export const { useGetCitiesQuery } = citiesApi;
