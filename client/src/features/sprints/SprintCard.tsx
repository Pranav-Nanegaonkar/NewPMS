import type { Sprint } from '../../types'
import Badge from '../../components/Badge'
import { sprintStatusColor } from '../../utils/enumColors'
import { formatDate } from '../../utils/format'

interface Props {
  sprint: Sprint
  onEdit?: () => void
  onDelete?: () => void
  onStatusChange?: (status: Sprint['status']) => void
  children?: React.ReactNode
}

export default function SprintCard({ sprint, onEdit, onDelete, onStatusChange, children }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900 text-sm">{sprint.name}</h3>
          <Badge label={sprint.status} className={sprintStatusColor[sprint.status]} />
        </div>
        <div className="flex items-center gap-2">
          {sprint.status === 'PLANNED' && onStatusChange && (
            <button
              onClick={() => onStatusChange('ACTIVE')}
              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Start
            </button>
          )}
          {sprint.status === 'ACTIVE' && onStatusChange && (
            <button
              onClick={() => onStatusChange('COMPLETED')}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Complete
            </button>
          )}
          {onEdit && (
            <button onClick={onEdit} className="text-xs text-gray-500 hover:text-blue-600 px-1">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-xs text-gray-500 hover:text-red-600 px-1">
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="px-4 py-2 bg-gray-50 flex items-center gap-4 text-xs text-gray-500 border-b border-gray-100">
        {sprint.goal && <span className="italic truncate max-w-xs">"{sprint.goal}"</span>}
        <span className="ml-auto flex-shrink-0">
          {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
        </span>
        <span className="flex-shrink-0">✓ {sprint.taskCount} tasks</span>
        {sprint.completedStoryPoints != null && (
          <span className="flex-shrink-0">{sprint.completedStoryPoints} pts done</span>
        )}
      </div>

      {/* Tasks slot */}
      {children && <div className="p-4">{children}</div>}
    </div>
  )
}
