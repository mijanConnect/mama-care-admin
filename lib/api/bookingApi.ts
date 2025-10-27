import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse, PaginatedResponse } from '../baseApi';

// Booking API slice
export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Booking'],
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: (params) => ({
        url: '/bookings',
        params,
      }),
      providesTags: ['Booking'],
    }),
  }),
});

export const {
  useGetBookingsQuery,
} = bookingApi;