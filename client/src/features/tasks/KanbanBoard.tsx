import type { Task, TaskStatus } from '../../types'
import TaskCard from './TaskCard'
import { taskStatusLabel, taskStatusColor } from '../../utils/enumColors'

const COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED']

interface Props {
  tasks: Task[]
  onAddTask?: (status: TaskStatus) => void
}

export default function KanbanBoard({ tasks, onAddTask }: Props) {
  const grouped = COLUMNS.reduce<Record<TaskStatus, Task[]>>(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status)
      return acc
    },
    {} as Record<TaskStatus, Task[]>
  )

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((status) => (
        <div key={status} className="flex-shrink-0 w-64">
          {/* Column header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${taskStatusColor[status]}`}>
                {taskStatusLabel[status]}
              </span>
              <span className="text-xs text-gray-500 font-medium">{grouped[status].length}</span>
            </div>
            {onAddTask && (
              <button
                onClick={() => onAddTask(status)}
                className="text-gray-400 hover:text-blue-600 text-lg leading-none"
                title={`Add task to ${taskStatusLabel[status]}`}
              >
                +
              </button>
            )}
          </div>

          {/* Cards */}
          <div className="space-y-2 min-h-[100px]">
            {grouped[status].length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-xs text-gray-400">
                No tasks
              </div>
            ) : (
              grouped[status].map((task) => (
                <TaskCard key={task.id} task={task} compact />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
