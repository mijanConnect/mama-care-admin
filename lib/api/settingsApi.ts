import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse, PaginatedResponse } from '../baseApi';

// Settings API slice
export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Settings'],

  endpoints: (builder) => ({
    getTermsAndCondition: builder.query({
      query: (params) => ({
        url: '/rules/terms-and-conditions',
        params,
      }),
      providesTags: ['Settings'],
    }),
    UpdateTermsAndCondition: builder.mutation({

      query: (data) => ({
        url: '/rules/terms-and-conditions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    getPrivacyPolicy: builder.query({
      query: (params) => ({
        url: '/rules/privacy-policy',
        params,
      }),
      providesTags: ['Settings'],
    }),
    UpdatePrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: '/rules/privacy-policy',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    getAboutUs: builder.query({
      query: (params) => ({
        url: '/rules/about-us',
        params,
      }),
      providesTags: ['Settings'],
    }),
    UpdateAboutUs: builder.mutation({
      query: (data) => ({
        url: '/rules/about-us',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),


  }),
});

export const {
useGetTermsAndConditionQuery,
useUpdateTermsAndConditionMutation,
useGetPrivacyPolicyQuery,
useUpdatePrivacyPolicyMutation,
useGetAboutUsQuery,
useUpdateAboutUsMutation,

} = settingsApi;
