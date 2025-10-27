import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse, PaginatedResponse } from '../baseApi';

// Type definitions
interface CreateBannerData {

  name: string;
  description: string;
  url: string;
}

// Banner API slice
export const bannerApi = createApi({
  reducerPath: 'bannerApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Banner'],
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: () => '/banners',
      providesTags: ['Banner'],
    }),


    
    createBanner: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/banners',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Banner'],
    }),
    updateBanner: builder.mutation<any, FormData>({
      query: (data) => ({
        url: '/banner',
        method: 'PATCH',
        body: data,
        // Don't set Content-Type header, let the browser set it with boundary for FormData
        formData: true,
      }),
      invalidatesTags: ['Banner'],
    }),

    updateBannerStatus: builder.mutation<any, number>({
      query: (id) => ({
        url: `/banners/status/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Banner'],
    }),



    DeleteBanner: builder.mutation<any, number>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useUpdateBannerStatusMutation,

  useDeleteBannerMutation,
} = bannerApi;

export type { CreateBannerData };
