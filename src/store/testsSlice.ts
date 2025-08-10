import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const testsApi = createApi({
  reducerPath: 'testsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    startTest: builder.mutation({
      query: (body) => ({
        url: '/tests/start',
        method: 'POST',
        body
      })
    }),
    saveAnswer: builder.mutation({
      query: ({ sessionId, answer }) => ({
        url: `/tests/${sessionId}/answer`,
        method: 'POST',
        body: answer
      })
    }),
    submitTest: builder.mutation({
      query: (sessionId) => ({
        url: `/tests/${sessionId}/submit`,
        method: 'POST'
      })
    }),
    getTestStatus: builder.query({
      query: (sessionId) => `/tests/${sessionId}`
    }),
    getTestHistory: builder.query({
      query: () => `/tests/history`
    })
  })
});

export const {
  useStartTestMutation,
  useSaveAnswerMutation,
  useSubmitTestMutation,
  useGetTestStatusQuery,
  useGetTestHistoryQuery
} = testsApi;
