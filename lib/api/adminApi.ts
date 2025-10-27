import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse, PaginatedResponse } from '../baseApi';

// Type definitions
interface CreateAdminData {
  name: string;
  email: string;
  role: string;
  password: string;
}

// Admin API slice
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    getAdmins: builder.query({
      query: () => '/admins',
      providesTags: ['Admin'],
    }),


    
    createAdmin: builder.mutation<any, CreateAdminData>({
      query: (data) => ({
        url: '/admins',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),

    DeleteAdmin: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;

export type { CreateAdminData };