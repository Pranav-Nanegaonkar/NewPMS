import { baseApi } from './baseApi'
import type { ApiResponse, Comment, CommentRequest } from '../types'

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByTask: builder.query<Comment[], number>({
      query: (taskId) => `/comments/task/${taskId}`,
      transformResponse: (res: ApiResponse<Comment[]>) => res.data,
      providesTags: (_r, _e, taskId) => [{ type: 'Comment', id: taskId }],
    }),
    addComment: builder.mutation<Comment, CommentRequest>({
      query: (body) => ({ url: '/comments', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Comment>) => res.data,
      invalidatesTags: (_r, _e, { taskId }) => [{ type: 'Comment', id: taskId }, 'Task'],
    }),
    updateComment: builder.mutation<
      Comment,
      { id: number; authorId: number; content: string; taskId: number }
    >({
      query: ({ id, authorId, content }) => ({
        url: `/comments/${id}?authorId=${authorId}`,
        method: 'PUT',
        body: content,
        headers: { 'Content-Type': 'text/plain' },
      }),
      transformResponse: (res: ApiResponse<Comment>) => res.data,
      invalidatesTags: (_r, _e, { taskId }) => [{ type: 'Comment', id: taskId }],
    }),
    deleteComment: builder.mutation<void, { id: number; authorId: number; taskId: number }>({
      query: ({ id, authorId }) => ({
        url: `/comments/${id}?authorId=${authorId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { taskId }) => [{ type: 'Comment', id: taskId }, 'Task'],
    }),
  }),
})

export const {
  useGetCommentsByTaskQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi
