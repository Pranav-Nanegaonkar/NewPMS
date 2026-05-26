import { Link } from 'react-router-dom'
import type { Task } from '../../types'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import {
  priorityColor,
  priorityDot,
  taskTypeIcon,
  taskStatusColor,
  taskStatusLabel,
} from '../../utils/enumColors'
import { formatDate, isOverdue, isDueSoon } from '../../utils/format'

interface Props {
  task: Task
  compact?: boolean
}

export default function TaskCard({ task, compact = false }: Props) {
  const overdue = isOverdue(task.dueDate)
  const dueSoon = isDueSoon(task.dueDate)

  return (
    <Link
      to={`/tasks/${task.id}`}
      className="block bg-white rounded border border-gray-200 p-3 hover:shadow-sm hover:border-blue-300 transition-all"
    >
      {/* Type + Priority */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm" title={task.type}>{taskTypeIcon[task.type]}</span>
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} title={task.priority} />
        {!compact && (
          <Badge
            label={taskStatusLabel[task.status]}
            className={`ml-auto ${taskStatusColor[task.status]}`}
          />
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{task.title}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {task.storyPoints != null && (
            <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
              {task.storyPoints} pts
            </span>
          )}
          {task.commentCount > 0 && <span>💬 {task.commentCount}</span>}
          {task.subTasks?.length > 0 && <span>⊞ {task.subTasks.length}</span>}
        </div>

        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className={overdue ? 'text-red-600 font-medium' : dueSoon ? 'text-orange-500' : ''}>
              {overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}
            </span>
          )}
          {task.assignee && <Avatar name={task.assignee.fullName} size="sm" />}
        </div>
      </div>
    </Link>
  )
}
