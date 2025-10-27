import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse, PaginatedResponse } from '../baseApi';

// Report API slice
export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Report'],
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (params) => ({
        url: '/reports',
        params,
      }),
      providesTags: ['Report'],
    }),
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `/reports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Report'],
    }),
    getSingleReport: builder.query({
      query: (id) => ({
        url: `/reports/${id}`,
      }),
      providesTags: ['Report'],
    }),
    updateReportStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/reports/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Report'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useDeleteReportMutation,
  useGetSingleReportQuery,
  useUpdateReportStatusMutation,
} = reportApi;