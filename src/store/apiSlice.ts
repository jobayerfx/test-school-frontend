import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthResponse, ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest, User } from '@/types/auth';
import { 
  DashboardComplete, 
  DashboardStats, 
  DashboardTrends, 
  DashboardCompetencies, 
  DashboardDemographics, 
  DashboardPerformance, 
  TopPerformers 
} from '@/types/dashboard';
import {
  IQuestion,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionsResponse,
  QuestionResponse,
  DeleteQuestionResponse,
  GetQuestionsParams
} from '@/types/question';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: ({ token, password }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, password },
      }),
    }),
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: ({ refreshToken }) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    validateToken: builder.query<User, void>({
      query: () => '/auth/me',
    }),
    // Dashboard endpoints
    getDashboardComplete: builder.query<DashboardComplete, void>({
      query: () => '/report/dashboard/complete',
    }),
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/report/dashboard/stats',
    }),
    getDashboardTrends: builder.query<DashboardTrends, void>({
      query: () => '/report/dashboard/trends',
    }),
    getDashboardCompetencies: builder.query<DashboardCompetencies, void>({
      query: () => '/report/dashboard/competencies',
    }),
    getDashboardDemographics: builder.query<DashboardDemographics, void>({
      query: () => '/report/dashboard/demographics',
    }),
    getDashboardPerformance: builder.query<DashboardPerformance, void>({
      query: () => '/report/dashboard/performance',
    }),
    getTopPerformers: builder.query<TopPerformers, void>({
      query: () => '/report/dashboard/top-performers',
    }),
    
    // Questions endpoints
    getQuestions2: builder.query<QuestionsResponse, void>({
      query: () => '/questions',
    }),
    getQuestions: builder.query<QuestionsResponse, GetQuestionsParams | void>({
      query: (params) => {
        // Build query string from params
        const queryParams = new URLSearchParams();
    
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.level) queryParams.append('level', params.level);
        if (params?.competency) queryParams.append('competency', params.competency);
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    
        const queryString = queryParams.toString();
    
        return `/questions${queryString ? `?${queryString}` : ''}`;
      },
    }),

    getQuestion: builder.query<QuestionResponse, string>({
      query: (id) => `/questions/${id}`,
    }),
    createQuestion: builder.mutation<QuestionResponse, CreateQuestionRequest>({
      query: (question) => ({
        url: '/questions',
        method: 'POST',
        body: question,
      }),
    }),
    updateQuestion: builder.mutation<QuestionResponse, UpdateQuestionRequest>({
      query: ({ id, ...question }) => ({
        url: `/questions/${id}`,
        method: 'PUT',
        body: question,
      }),
    }),
    deleteQuestion: builder.mutation<DeleteQuestionResponse, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { 
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useValidateTokenQuery,
  // Dashboard hooks
  useGetDashboardCompleteQuery,
  useGetDashboardStatsQuery,
  useGetDashboardTrendsQuery,
  useGetDashboardCompetenciesQuery,
  useGetDashboardDemographicsQuery,
  useGetDashboardPerformanceQuery,
  useGetTopPerformersQuery,
  // Questions hooks
  useGetQuestionsQuery,
  useGetQuestionQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
 } = apiSlice;
