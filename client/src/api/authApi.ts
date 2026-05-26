import { baseApi } from './baseApi'
import type { ApiResponse, AuthResponse, LoginRequest, SignupRequest, ChangePasswordRequest } from '../types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<ApiResponse<AuthResponse>, SignupRequest>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    validateToken: builder.query<ApiResponse<boolean>, void>({
      query: () => '/auth/validate',
    }),
    changePassword: builder.mutation<ApiResponse<void>, ChangePasswordRequest>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useValidateTokenQuery,
  useChangePasswordMutation,
} = authApi
