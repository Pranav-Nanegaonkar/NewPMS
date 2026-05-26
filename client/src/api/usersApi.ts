import { baseApi } from './baseApi'
import type { ApiResponse, User, UserRequest, UserRole } from '../types'

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => '/users',
      transformResponse: (res: ApiResponse<User[]>) => res.data,
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      transformResponse: (res: ApiResponse<User>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'User', id }],
    }),
    getUsersByRole: builder.query<User[], UserRole>({
      query: (role) => `/users/role/${role}`,
      transformResponse: (res: ApiResponse<User[]>) => res.data,
      providesTags: ['User'],
    }),
    getUsersByDepartment: builder.query<User[], string>({
      query: (dept) => `/users/department/${dept}`,
      transformResponse: (res: ApiResponse<User[]>) => res.data,
      providesTags: ['User'],
    }),
    searchUsers: builder.query<User[], string>({
      query: (keyword) => `/users/search?keyword=${encodeURIComponent(keyword)}`,
      transformResponse: (res: ApiResponse<User[]>) => res.data,
      providesTags: ['User'],
    }),
    createUser: builder.mutation<User, UserRequest>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      transformResponse: (res: ApiResponse<User>) => res.data,
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: number; body: UserRequest }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
      transformResponse: (res: ApiResponse<User>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'User', id }, 'User'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUsersByRoleQuery,
  useGetUsersByDepartmentQuery,
  useSearchUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi
