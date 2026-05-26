import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../app/store'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
        ?? localStorage.getItem('pms_token')
        ?? sessionStorage.getItem('pms_token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Project', 'Task', 'Sprint', 'User', 'Comment', 'ActivityLog', 'Member'],
  endpoints: () => ({}),
})
