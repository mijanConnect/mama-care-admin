import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse } from '../baseApi';

// Gallery API slice
export const galleryApi = createApi({
  reducerPath: 'galleryApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Gallery'],
  endpoints: (builder) => ({
    getGallery: builder.query({
      query: () => '/gallery',
      providesTags: ['Gallery'],
    }),
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: '/gallery/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Gallery'],
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useUploadImageMutation,
} = galleryApi;