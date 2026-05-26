import { baseApi } from './baseApi'
import type { ApiResponse, Sprint, SprintRequest, SprintStatus } from '../types'

export const sprintsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSprintById: builder.query<Sprint, number>({
      query: (id) => `/sprints/${id}`,
      transformResponse: (res: ApiResponse<Sprint>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Sprint', id }],
    }),
    getSprintsByProject: builder.query<Sprint[], number>({
      query: (projectId) => `/sprints/project/${projectId}`,
      transformResponse: (res: ApiResponse<Sprint[]>) => res.data,
      providesTags: ['Sprint'],
    }),
    getSprintsByProjectAndStatus: builder.query<
      Sprint[],
      { projectId: number; status: SprintStatus }
    >({
      query: ({ projectId, status }) => `/sprints/project/${projectId}/status/${status}`,
      transformResponse: (res: ApiResponse<Sprint[]>) => res.data,
      providesTags: ['Sprint'],
    }),
    createSprint: builder.mutation<Sprint, SprintRequest>({
      query: (body) => ({ url: '/sprints', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Sprint>) => res.data,
      invalidatesTags: ['Sprint'],
    }),
    updateSprint: builder.mutation<Sprint, { id: number; body: SprintRequest }>({
      query: ({ id, body }) => ({ url: `/sprints/${id}`, method: 'PUT', body }),
      transformResponse: (res: ApiResponse<Sprint>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Sprint', id }, 'Sprint'],
    }),
    updateSprintStatus: builder.mutation<Sprint, { id: number; status: SprintStatus }>({
      query: ({ id, status }) => ({
        url: `/sprints/${id}/status?status=${status}`,
        method: 'PATCH',
      }),
      transformResponse: (res: ApiResponse<Sprint>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Sprint', id }, 'Sprint'],
    }),
    deleteSprint: builder.mutation<void, number>({
      query: (id) => ({ url: `/sprints/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Sprint'],
    }),
  }),
})

export const {
  useGetSprintByIdQuery,
  useGetSprintsByProjectQuery,
  useGetSprintsByProjectAndStatusQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useUpdateSprintStatusMutation,
  useDeleteSprintMutation,
} = sprintsApi
