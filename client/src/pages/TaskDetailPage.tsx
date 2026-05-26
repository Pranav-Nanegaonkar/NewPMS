import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useDeleteTaskMutation,
  useCreateTaskMutation,
} from '../api/tasksApi'
import { useGetCommentsByTaskQuery, useAddCommentMutation, useDeleteCommentMutation } from '../api/commentsApi'
import { useGetLogsByTaskQuery } from '../api/activityApi'
import { useGetAllUsersQuery } from '../api/usersApi'
import { useAppSelector } from '../app/hooks'
import type { TaskRequest, TaskStatus } from '../types'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import TaskForm from '../features/tasks/TaskForm'
import TaskCard from '../features/tasks/TaskCard'
import {
  taskStatusColor,
  taskStatusLabel,
  priorityColor,
  taskTypeColor,
  taskTypeIcon,
} from '../utils/enumColors'
import { formatDate, formatDateTime, timeAgo, isOverdue } from '../utils/format'

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const taskId = Number(id)
  const navigate = useNavigate()
  const currentUser = useAppSelector((s) => s.currentUser.user)

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAddSubtask, setShowAddSubtask] = useState(false)
  const [commentText, setCommentText] = useState('')

  const { data: task, isLoading } = useGetTaskByIdQuery(taskId)
  const { data: comments = [] } = useGetCommentsByTaskQuery(taskId)
  const { data: logs = [] } = useGetLogsByTaskQuery(taskId)
  const { data: allUsers = [] } = useGetAllUsersQuery()

  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation()
  const [updateStatus] = useUpdateTaskStatusMutation()
  const [assignTask] = useAssignTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [createTask, { isLoading: creatingSubtask }] = useCreateTaskMutation()
  const [addComment, { isLoading: addingComment }] = useAddCommentMutation()
  const [deleteComment] = useDeleteCommentMutation()

  if (isLoading) return <Spinner className="mt-20" />
  if (!task) return <div className="text-center py-20 text-gray-500">Task not found</div>

  async function handleUpdate(data: TaskRequest) {
    await updateTask({ id: taskId, body: data }).unwrap()
    setShowEdit(false)
  }

  async function handleDelete() {
    await deleteTask(taskId).unwrap()
    navigate(-1)
  }

  async function handleAddSubtask(data: TaskRequest) {
    await createTask({ ...data, parentTaskId: taskId }).unwrap()
    setShowAddSubtask(false)
  }

  async function handleAddComment() {
    if (!commentText.trim() || !currentUser) return
    await addComment({ taskId, authorId: currentUser.id, content: commentText.trim() }).unwrap()
    setCommentText('')
  }

  const overdue = isOverdue(task.dueDate)

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/projects" className="hover:text-blue-600">Projects</Link>
        <span>/</span>
        <Link to={`/projects/${task.projectId}`} className="hover:text-blue-600">{task.projectName}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{task.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Task header */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg">{taskTypeIcon[task.type]}</span>
                <Badge label={task.type} className={taskTypeColor[task.type]} />
                <Badge
                  label={taskStatusLabel[task.status]}
                  className={taskStatusColor[task.status]}
                />
                <Badge label={task.priority} className={priorityColor[task.priority]} />
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <button
                  onClick={() => setShowEdit(true)}
                  className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-3">{task.title}</h1>

            {task.description && (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>
            )}
          </div>

          {/* Subtasks */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">
                Subtasks ({task.subTasks?.length ?? 0})
              </h2>
              <button
                onClick={() => setShowAddSubtask(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add subtask
              </button>
            </div>
            <div className="p-4">
              {!task.subTasks || task.subTasks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No subtasks</p>
              ) : (
                <div className="space-y-2">
                  {task.subTasks.map((sub) => (
                    <TaskCard key={sub.id} task={sub} compact />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">
                Comments ({comments.length})
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {/* Add comment */}
              {currentUser && (
                <div className="flex gap-3">
                  <Avatar name={currentUser.fullName} size="sm" />
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={2}
                      placeholder="Add a comment..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={!commentText.trim() || addingComment}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {addingComment ? 'Posting...' : 'Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Comment list */}
              {comments.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar name={comment.author.fullName} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.author.fullName}
                        </span>
                        <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                        {currentUser?.id === comment.author.id && (
                          <button
                            onClick={() =>
                              deleteComment({
                                id: comment.id,
                                authorId: currentUser.id,
                                taskId,
                              })
                            }
                            className="text-xs text-red-400 hover:text-red-600 ml-auto"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity */}
          {logs.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-sm">Activity</h2>
              </div>
              <div className="p-4 space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-sm">
                    <Avatar name={log.performedBy.fullName} size="sm" />
                    <div>
                      <span className="font-medium">{log.performedBy.fullName}</span>{' '}
                      <span className="text-gray-600">{log.action}</span>
                      {log.oldValue && log.newValue && (
                        <span className="text-gray-500">
                          {' '}·{' '}
                          <span className="line-through text-red-400">{log.oldValue}</span>{' '}
                          → <span className="text-green-600">{log.newValue}</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-400 ml-2">{timeAgo(log.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateStatus({ id: taskId, status: e.target.value as TaskStatus })
                  }
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="DONE">Done</option>
                  <option value="BLOCKED">Blocked</option>
                </select>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Assignee</p>
                <select
                  value={task.assignee?.id ?? ''}
                  onChange={(e) => {
                    if (e.target.value) assignTask({ id: taskId, userId: Number(e.target.value) })
                  }}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Reporter</p>
                <div className="flex items-center gap-2">
                  <Avatar name={task.reporter.fullName} size="sm" />
                  <span className="text-sm text-gray-800">{task.reporter.fullName}</span>
                </div>
              </div>

              {task.sprintName && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Sprint</p>
                  <p className="text-sm text-gray-800">{task.sprintName}</p>
                </div>
              )}

              {task.storyPoints != null && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Story Points</p>
                  <p className="text-sm font-semibold text-gray-800">{task.storyPoints}</p>
                </div>
              )}

              {task.dueDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Due Date</p>
                  <p className={`text-sm font-medium ${overdue ? 'text-red-600' : 'text-gray-800'}`}>
                    {overdue && '⚠ '}{formatDate(task.dueDate)}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 mb-1">Created</p>
                <p className="text-xs text-gray-600">{formatDateTime(task.createdAt)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Updated</p>
                <p className="text-xs text-gray-600">{formatDateTime(task.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Parent task */}
          {task.parentTaskId && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Parent Task
              </h3>
              <Link
                to={`/tasks/${task.parentTaskId}`}
                className="text-sm text-blue-600 hover:underline"
              >
                View parent task →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showEdit && (
        <Modal title="Edit Task" onClose={() => setShowEdit(false)} size="lg">
          <TaskForm
            projectId={task.projectId}
            defaultValues={task}
            onSubmit={handleUpdate}
            onCancel={() => setShowEdit(false)}
            isLoading={updating}
          />
        </Modal>
      )}

      {showAddSubtask && (
        <Modal title="Add Subtask" onClose={() => setShowAddSubtask(false)} size="lg">
          <TaskForm
            projectId={task.projectId}
            defaultValues={{ projectId: task.projectId, sprintId: task.sprintId }}
            onSubmit={handleAddSubtask}
            onCancel={() => setShowAddSubtask(false)}
            isLoading={creatingSubtask}
          />
        </Modal>
      )}

      {showDelete && (
        <ConfirmDialog
          title="Delete Task"
          message="Delete this task and all its subtasks? This cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  )
}
