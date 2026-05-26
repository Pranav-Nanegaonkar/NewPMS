import { baseApi } from './baseApi'
import type { ActivityLog, ApiResponse } from '../types'

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogsByProject: builder.query<ActivityLog[], number>({
      query: (projectId) => `/activity-logs/project/${projectId}`,
      transformResponse: (res: ApiResponse<ActivityLog[]>) => res.data,
      providesTags: ['ActivityLog'],
    }),
    getLogsByTask: builder.query<ActivityLog[], number>({
      query: (taskId) => `/activity-logs/task/${taskId}`,
      transformResponse: (res: ApiResponse<ActivityLog[]>) => res.data,
      providesTags: ['ActivityLog'],
    }),
    getLogsByUser: builder.query<ActivityLog[], number>({
      query: (userId) => `/activity-logs/user/${userId}`,
      transformResponse: (res: ApiResponse<ActivityLog[]>) => res.data,
      providesTags: ['ActivityLog'],
    }),
  }),
})

export const {
  useGetLogsByProjectQuery,
  useGetLogsByTaskQuery,
  useGetLogsByUserQuery,
} = activityApi
