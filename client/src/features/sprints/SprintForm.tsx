import { useForm } from 'react-hook-form'
import type { Sprint, SprintRequest } from '../../types'

interface Props {
  projectId: number
  defaultValues?: Partial<Sprint>
  onSubmit: (data: SprintRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function SprintForm({ projectId, defaultValues, onSubmit, onCancel, isLoading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<SprintRequest>({
    defaultValues: {
      projectId,
      name: defaultValues?.name ?? '',
      goal: defaultValues?.goal ?? '',
      status: defaultValues?.status ?? 'PLANNED',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sprint Name *</label>
        <input
          {...register('name', { required: 'Name is required' })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Sprint 2"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
        <textarea
          {...register('goal')}
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Sprint goal"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          {...register('status')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PLANNED">Planned</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            {...register('startDate')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            {...register('endDate')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
