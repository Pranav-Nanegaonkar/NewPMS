import { baseApi } from './baseApi'
import type {
  ApiResponse,
  Project,
  ProjectMember,
  ProjectMemberRequest,
  ProjectRequest,
  ProjectStatus,
  Priority,
} from '../types'

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query<Project[], void>({
      query: () => '/projects',
      transformResponse: (res: ApiResponse<Project[]>) => res.data,
      providesTags: ['Project'],
    }),
    getProjectById: builder.query<Project, number>({
      query: (id) => `/projects/${id}`,
      transformResponse: (res: ApiResponse<Project>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Project', id }],
    }),
    getProjectsByStatus: builder.query<Project[], ProjectStatus>({
      query: (status) => `/projects/status/${status}`,
      transformResponse: (res: ApiResponse<Project[]>) => res.data,
      providesTags: ['Project'],
    }),
    getProjectsByPriority: builder.query<Project[], Priority>({
      query: (priority) => `/projects/priority/${priority}`,
      transformResponse: (res: ApiResponse<Project[]>) => res.data,
      providesTags: ['Project'],
    }),
    getProjectsByOwner: builder.query<Project[], number>({
      query: (ownerId) => `/projects/owner/${ownerId}`,
      transformResponse: (res: ApiResponse<Project[]>) => res.data,
      providesTags: ['Project'],
    }),
    getProjectsByMember: builder.query<Project[], number>({
      query: (userId) => `/projects/member/${userId}`,
      transformResponse: (res: ApiResponse<Project[]>) => res.data,
      providesTags: ['Project'],
    }),
    searchProjects: builder.query<Project[], string>({
      query: (keyword) => `/projects/search?keyword=${encodeURIComponent(keyword)}`,
      transformResponse: (res: ApiResponse<Project[]>) => res.data,
      providesTags: ['Project'],
    }),
    createProject: builder.mutation<Project, ProjectRequest>({
      query: (body) => ({ url: '/projects', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Project>) => res.data,
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<Project, { id: number; body: ProjectRequest }>({
      query: ({ id, body }) => ({ url: `/projects/${id}`, method: 'PUT', body }),
      transformResponse: (res: ApiResponse<Project>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Project', id }, 'Project'],
    }),
    updateProjectStatus: builder.mutation<Project, { id: number; status: ProjectStatus }>({
      query: ({ id, status }) => ({
        url: `/projects/${id}/status?status=${status}`,
        method: 'PATCH',
      }),
      transformResponse: (res: ApiResponse<Project>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Project', id }, 'Project'],
    }),
    deleteProject: builder.mutation<void, number>({
      query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Project'],
    }),
    // Members
    getProjectMembers: builder.query<ProjectMember[], number>({
      query: (projectId) => `/projects/${projectId}/members`,
      transformResponse: (res: ApiResponse<ProjectMember[]>) => res.data,
      providesTags: (_r, _e, projectId) => [{ type: 'Member', id: projectId }],
    }),
    addMember: builder.mutation<ProjectMember, { projectId: number; body: ProjectMemberRequest }>({
      query: ({ projectId, body }) => ({
        url: `/projects/${projectId}/members`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiResponse<ProjectMember>) => res.data,
      invalidatesTags: (_r, _e, { projectId }) => [{ type: 'Member', id: projectId }],
    }),
    updateMemberRole: builder.mutation<
      ProjectMember,
      { projectId: number; userId: number; body: ProjectMemberRequest }
    >({
      query: ({ projectId, userId, body }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: ApiResponse<ProjectMember>) => res.data,
      invalidatesTags: (_r, _e, { projectId }) => [{ type: 'Member', id: projectId }],
    }),
    removeMember: builder.mutation<void, { projectId: number; userId: number }>({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { projectId }) => [{ type: 'Member', id: projectId }],
    }),
  }),
})

export const {
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useGetProjectsByStatusQuery,
  useGetProjectsByPriorityQuery,
  useGetProjectsByOwnerQuery,
  useGetProjectsByMemberQuery,
  useSearchProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUpdateProjectStatusMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
  useAddMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} = projectsApi
