import { baseApi } from './baseApi'
import type { ApiResponse, Task, TaskRequest, TaskStatus, Priority, TaskType } from '../types'

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      transformResponse: (res: ApiResponse<Task[]>) => res.data,
      providesTags: ['Task'],
    }),
    getTaskById: builder.query<Task, number>({
      query: (id) => `/tasks/${id}`,
      transformResponse: (res: ApiResponse<Task>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Task', id }],
    }),
    getTasksByProject: builder.query<Task[], number>({
      query: (projectId) => `/tasks/project/${projectId}`,
      transformResponse: (res: ApiResponse<Task[]>) => res.data,
      providesTags: ['Task'],
    }),
    getRootTasksByProject: builder.query<Task[], number>({
      query: (projectId) => `/tasks/project/${projectId}/root`,
      transformResponse: (res: ApiResponse<Task[]>) => res.data,
      providesTags: ['Task'],
    }),
    getTasksBySprint: builder.query<Task[], number>({
      query: (sprintId) => `/tasks/sprint/${sprintId}`,
      transformResponse: (res: ApiResponse<Task[]>) => res.data,
      providesTags: ['Task'],
    }),
    getTasksByAssignee: builder.query<Task[], number>({
      query: (userId) => `/tasks/assignee/${userId}`,
      transformResponse: (res: ApiResponse<Task[]>) => res.data,
      providesTags: ['Task'],
    }),
    getSubTasks: builder.query<Task[], number>({
      query: (taskId) => `/tasks/${taskId}/subtasks`,
      transformResponse: (res: ApiResponse<Task[]>) => res.data,
      providesTags: ['Task'],
    }),
    filterTasks: builder.query<
      Task[],
      { projectId: number; status?: TaskStatus; priority?: Priority; type?: TaskType }
    >({
      query: ({ projectId, status, priority, type }) => {
        const params = new URLSearchParams()
        if (status) params.set('status', status)
        if (priority) params.set('priority', priority)
        if (type) params.set('type', type)
        return `/tasks/project/${projectId}/filter?${params.toString()}`
      },
      transformResponse: (res: ApiResponse<Task[]>) => res.data,
      providesTags: ['Task'],
    }),
    searchTasksInProject: builder.query<Task[], { projectId: number; keyword: string }>({
      query: ({ projectId, keyword }) =>
        `/tasks/project/${projectId}/search?keyword=${encodeURIComponent(keyword)}`,
      transformResponse: (res: ApiResponse<Task[]>) => res.data,
      providesTags: ['Task'],
    }),
    createTask: builder.mutation<Task, TaskRequest>({
      query: (body) => ({ url: '/tasks', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Task>) => res.data,
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<Task, { id: number; body: TaskRequest }>({
      query: ({ id, body }) => ({ url: `/tasks/${id}`, method: 'PUT', body }),
      transformResponse: (res: ApiResponse<Task>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Task', id }, 'Task'],
    }),
    updateTaskStatus: builder.mutation<Task, { id: number; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status?status=${status}`,
        method: 'PATCH',
      }),
      transformResponse: (res: ApiResponse<Task>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Task', id }, 'Task'],
    }),
    assignTask: builder.mutation<Task, { id: number; userId: number }>({
      query: ({ id, userId }) => ({
        url: `/tasks/${id}/assign/${userId}`,
        method: 'PATCH',
      }),
      transformResponse: (res: ApiResponse<Task>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Task', id }, 'Task'],
    }),
    moveTaskToSprint: builder.mutation<Task, { id: number; sprintId: number }>({
      query: ({ id, sprintId }) => ({
        url: `/tasks/${id}/sprint/${sprintId}`,
        method: 'PATCH',
      }),
      transformResponse: (res: ApiResponse<Task>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Task', id }, 'Task'],
    }),
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),
  }),
})

export const {
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useGetTasksByProjectQuery,
  useGetRootTasksByProjectQuery,
  useGetTasksBySprintQuery,
  useGetTasksByAssigneeQuery,
  useGetSubTasksQuery,
  useFilterTasksQuery,
  useSearchTasksInProjectQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useMoveTaskToSprintMutation,
  useDeleteTaskMutation,
} = tasksApi
