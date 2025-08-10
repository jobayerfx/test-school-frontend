import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const questionsApi = createApi({
  reducerPath: 'questionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['Question'],
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: () => '/questions',
      providesTags: ['Question']
    }),
    createQuestion: builder.mutation({
      query: (body) => ({
        url: '/questions',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Question']
    }),
    updateQuestion: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/questions/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Question']
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Question']
    }),
  })
});

export const {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation
} = questionsApi;
