import { useForm } from 'react-hook-form'
import type { Task, TaskRequest } from '../../types'
import { useGetAllUsersQuery } from '../../api/usersApi'
import { useGetSprintsByProjectQuery } from '../../api/sprintsApi'
import { useAppSelector } from '../../app/hooks'

interface Props {
  projectId: number
  defaultValues?: Partial<Task>
  onSubmit: (data: TaskRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function TaskForm({ projectId, defaultValues, onSubmit, onCancel, isLoading }: Props) {
  const { data: users = [] } = useGetAllUsersQuery()
  const { data: sprints = [] } = useGetSprintsByProjectQuery(projectId)
  const currentUser = useAppSelector((s) => s.currentUser.user)

  const { register, handleSubmit, formState: { errors } } = useForm<TaskRequest>({
    defaultValues: {
      projectId,
      sprintId: defaultValues?.sprintId ?? null,
      parentTaskId: defaultValues?.parentTaskId ?? null,
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      type: defaultValues?.type ?? 'FEATURE',
      status: defaultValues?.status ?? 'TODO',
      priority: defaultValues?.priority ?? 'MEDIUM',
      assigneeId: defaultValues?.assignee?.id ?? null,
      reporterId: defaultValues?.reporter?.id ?? currentUser?.id,
      storyPoints: defaultValues?.storyPoints ?? null,
      dueDate: defaultValues?.dueDate ?? null,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task title"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task description"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select
            {...register('type', { required: true })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="FEATURE">Feature</option>
            <option value="BUG">Bug</option>
            <option value="IMPROVEMENT">Improvement</option>
            <option value="DOCUMENTATION">Documentation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            {...register('status', { required: true })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
          <select
            {...register('priority', { required: true })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
          <select
            {...register('assigneeId', { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.fullName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reporter *</label>
          <select
            {...register('reporterId', { required: 'Reporter is required', valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select reporter</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.fullName}</option>
            ))}
          </select>
          {errors.reporterId && <p className="text-red-500 text-xs mt-1">{errors.reporterId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sprint</label>
          <select
            {...register('sprintId', { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Backlog (no sprint)</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
          <input
            type="number"
            min={0}
            {...register('storyPoints', { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
