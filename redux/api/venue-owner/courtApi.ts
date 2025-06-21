import { baseApi } from "../baseApi";
import type { ApiResponse, Court, CreateCourtRequest, UpdateCourtRequest } from '@/types/api';

export const courtApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createCourt: builder.mutation<ApiResponse<null>, CreateCourtRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/CreateCourt",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{type: "Courts", id: 'LIST'}],
    }),
    getCourts: builder.query<Court[], void>({
      query: () => {
        // Get userId from localStorage
        let userId = '';
        if (typeof window !== 'undefined') {
          const user = localStorage.getItem('user');
          if (user) {
            const userData = JSON.parse(user);
            userId = userData.userId || '';
          }
        }
        return {
          url: "/web/api/v1/venue/GetCourt",
          params: { userId }
        };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ courtId }) => ({ type: 'Courts' as const, id: courtId })), { type: 'Courts', id: 'LIST' }]
          : [{ type: 'Courts', id: 'LIST' }],
    }),
    getCourtById: builder.query<Court, { courtId: string }>({
      query: ({ courtId }) => ({
        url: "/web/api/v1/venue/GetCourtById",
        params: { courtId },
      }),
      providesTags: (result, error, { courtId }) => [{ type: "Courts", id: courtId }],
    }),
    updateCourt: builder.mutation<ApiResponse<null>, UpdateCourtRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/UpdateCourt",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { courtId }) => [{ type: 'Courts', id: courtId }],
    }),
    uploadCourtImage: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/UploadCourtImage",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, formData) => [{ type: 'Courts', id: formData.get('courtId') as string }],
    }),
    deleteCourt: builder.mutation<ApiResponse<null>, { courtId: string }>({
        query: ({ courtId }) => ({
          url: "/web/api/v1/venue/DeleteCourt",
          method: "POST",
          body: { courtId },
        }),
        invalidatesTags: (result, error, { courtId }) => [{ type: 'Courts', id: courtId }, {type: 'Courts', id: 'LIST'}],
      }),
  }),
});

export const {
    useCreateCourtMutation,
    useGetCourtsQuery,
    useGetCourtByIdQuery,
    useUpdateCourtMutation,
    useUploadCourtImageMutation,
    useDeleteCourtMutation,
} = courtApi;
