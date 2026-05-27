import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from '../api/projectsApi'
import {
  useGetTasksByProjectQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
} from '../api/tasksApi'
import {
  useGetSprintsByProjectQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useUpdateSprintStatusMutation,
  useDeleteSprintMutation,
} from '../api/sprintsApi'
import { useGetLogsByProjectQuery } from '../api/activityApi'
import { useGetAllUsersQuery } from '../api/usersApi'
import { useToast } from '../components/ToastContainer'
import type {
  ProjectRequest,
  TaskRequest,
  SprintRequest,
  TaskStatus,
  ProjectMemberRequest,
  ProjectMemberRole,
  User,
  Sprint,
} from '../types'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import KanbanBoard from '../features/tasks/KanbanBoard'
import TaskCard from '../features/tasks/TaskCard'
import TaskForm from '../features/tasks/TaskForm'
import ProjectForm from '../features/projects/ProjectForm'
import SprintCard from '../features/sprints/SprintCard'
import SprintForm from '../features/sprints/SprintForm'
import {
  projectStatusColor,
  projectStatusLabel,
  priorityColor,
} from '../utils/enumColors'
import { formatDate, timeAgo } from '../utils/format'

type Tab = 'board' | 'backlog' | 'sprints' | 'members' | 'activity'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const projectId = Number(id)
  const navigate = useNavigate()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState<Tab>('board')
  const [showEditProject, setShowEditProject] = useState(false)
  const [showDeleteProject, setShowDeleteProject] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>('TODO')
  const [showCreateSprint, setShowCreateSprint] = useState(false)
  const [editSprintId, setEditSprintId] = useState<number | null>(null)
  const [deleteSprintId, setDeleteSprintId] = useState<number | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null)
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null)

  const { data: project, isLoading } = useGetProjectByIdQuery(projectId)
  const { data: tasks = [] } = useGetTasksByProjectQuery(projectId)
  const { data: sprints = [] } = useGetSprintsByProjectQuery(projectId)
  const { data: members = [] } = useGetProjectMembersQuery(projectId)
  const { data: logs = [] } = useGetLogsByProjectQuery(projectId)
  const { data: allUsers = [] } = useGetAllUsersQuery()

  const [updateProject, { isLoading: updatingProject }] = useUpdateProjectMutation()
  const [deleteProject, { isLoading: deletingProject }] = useDeleteProjectMutation()
  const [createTask, { isLoading: creatingTask }] = useCreateTaskMutation()
  const [deleteTask, { isLoading: deletingTask }] = useDeleteTaskMutation()
  const [createSprint, { isLoading: creatingSprint }] = useCreateSprintMutation()
  const [updateSprint, { isLoading: updatingSprint }] = useUpdateSprintMutation()
  const [updateSprintStatus] = useUpdateSprintStatusMutation()
  const [deleteSprintMutation, { isLoading: deletingSprint }] = useDeleteSprintMutation()
  const [addMember, { isLoading: addingMember }] = useAddMemberMutation()
  const [removeMember, { isLoading: removingMember }] = useRemoveMemberMutation()
  const [updateMemberRole] = useUpdateMemberRoleMutation()

  const backlogTasks = tasks.filter((t) => !t.sprintId)
  const sprintToEdit = sprints.find((s) => s.id === editSprintId)

  if (isLoading) return <Spinner className="mt-20" />
  if (!project) return <div className="text-center py-20 text-gray-500">Project not found</div>

  async function handleUpdateProject(data: ProjectRequest) {
    try {
      await updateProject({ id: projectId, body: data }).unwrap()
      setShowEditProject(false)
      toast.success('Project updated')
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message ?? 'Failed to update project')
    }
  }

  async function handleDeleteProject() {
    try {
      await deleteProject(projectId).unwrap()
      toast.success('Project deleted')
      navigate('/projects')
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message ?? 'Failed to delete project')
      setShowDeleteProject(false)
    }
  }

  async function handleCreateTask(data: TaskRequest) {
    try {
      await createTask({ ...data, status: createTaskStatus }).unwrap()
      setShowCreateTask(false)
      toast.success('Task created')
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message ?? 'Failed to create task')
    }
  }

  async function handleDeleteTask() {
    if (!deleteTaskId) return
    try {
      await deleteTask(deleteTaskId).unwrap()
      toast.success('Task deleted')
      setDeleteTaskId(null)
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message ?? 'Failed to delete task')
    }
  }

  async function handleCreateSprint(data: SprintRequest) {
    try {
      await createSprint(data).unwrap()
      setShowCreateSprint(false)
      toast.success('Sprint created')
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message ?? 'Failed to create sprint')
    }
  }

  async function handleUpdateSprint(data: SprintRequest) {
    if (editSprintId) {
      try {
        await updateSprint({ id: editSprintId, body: data }).unwrap()
        setEditSprintId(null)
        toast.success('Sprint updated')
      } catch (err: unknown) {
        const error = err as { data?: { message?: string } }
        toast.error(error?.data?.message ?? 'Failed to update sprint')
      }
    }
  }

  async function handleDeleteSprint() {
    if (!deleteSprintId) return
    try {
      await deleteSprintMutation(deleteSprintId).unwrap()
      toast.success('Sprint deleted')
      setDeleteSprintId(null)
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message ?? 'Failed to delete sprint')
    }
  }

  async function handleRemoveMember() {
    if (!deleteMemberId) return
    try {
      await removeMember({ projectId, userId: deleteMemberId }).unwrap()
      toast.success('Member removed')
      setDeleteMemberId(null)
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message ?? 'Failed to remove member')
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'board', label: 'Board' },
    { key: 'backlog', label: `Backlog (${backlogTasks.length})` },
    { key: 'sprints', label: `Sprints (${sprints.length})` },
    { key: 'members', label: `Members (${members.length})` },
    { key: 'activity', label: 'Activity' },
  ]

  return (
    <div className="space-y-5">
      {/* Project Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 truncate">{project.name}</h1>
              <Badge
                label={projectStatusLabel[project.status]}
                className={projectStatusColor[project.status]}
              />
              <Badge label={project.priority} className={priorityColor[project.priority]} />
            </div>
            {project.description && (
              <p className="text-sm text-gray-600 mb-3">{project.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <div className="flex items-center gap-1">
                <Avatar name={project.owner.fullName} size="sm" />
                <span>{project.owner.fullName}</span>
              </div>
              <span>👥 {project.memberCount} members</span>
              <span>✓ {project.taskCount} tasks</span>
              {project.startDate && (
                <span>{formatDate(project.startDate)} → {formatDate(project.endDate)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => setShowEditProject(true)}
              className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteProject(true)}
              className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Board ── */}
      {activeTab === 'board' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Kanban Board</h2>
            <button
              onClick={() => { setCreateTaskStatus('TODO'); setShowCreateTask(true) }}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              + Add Task
            </button>
          </div>
          <KanbanBoard
            tasks={tasks}
            onAddTask={(status) => { setCreateTaskStatus(status); setShowCreateTask(true) }}
          />
        </div>
      )}

      {/* ── Backlog ── */}
      {activeTab === 'backlog' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Backlog</h2>
            <button
              onClick={() => { setCreateTaskStatus('TODO'); setShowCreateTask(true) }}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              + Add Task
            </button>
          </div>
          {backlogTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No tasks in backlog</div>
          ) : (
            <div className="space-y-2">
              {backlogTasks.map((task) => (
                <div key={task.id} className="relative group">
                  <TaskCard task={task} />
                  <button
                    onClick={() => setDeleteTaskId(task.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs text-red-500 bg-white border border-red-200 rounded px-1.5 py-0.5"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Sprints ── */}
      {activeTab === 'sprints' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Sprints</h2>
            <button
              onClick={() => setShowCreateSprint(true)}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              + New Sprint
            </button>
          </div>
          {sprints.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No sprints yet</div>
          ) : (
            <div className="space-y-4">
              {sprints.map((sprint) => {
                const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id)
                return (
                  <SprintCard
                    key={sprint.id}
                    sprint={sprint}
                    onEdit={() => setEditSprintId(sprint.id)}
                    onDelete={() => setDeleteSprintId(sprint.id)}
                    onStatusChange={(status) =>
                      updateSprintStatus({ id: sprint.id, status })
                    }
                  >
                    {sprintTasks.length > 0 && (
                      <div className="space-y-2">
                        {sprintTasks.map((task) => (
                          <TaskCard key={task.id} task={task} compact />
                        ))}
                      </div>
                    )}
                  </SprintCard>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Members ── */}
      {activeTab === 'members' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Members</h2>
            <button
              onClick={() => setShowAddMember(true)}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              + Add Member
            </button>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {members.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">No members yet</div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="flex items-center gap-4 px-4 py-3">
                  <Avatar name={member.user.fullName} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{member.user.fullName}</p>
                    <p className="text-xs text-gray-500">{member.user.email} · {member.user.department}</p>
                  </div>
                  <select
                    value={member.roleInProject}
                    onChange={(e) =>
                      updateMemberRole({
                        projectId,
                        userId: member.user.id,
                        body: {
                          userId: member.user.id,
                          roleInProject: e.target.value as ProjectMemberRole,
                        },
                      })
                    }
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="LEAD">Lead</option>
                    <option value="MEMBER">Member</option>
                    <option value="REVIEWER">Reviewer</option>
                  </select>
                  <button
                    onClick={() => removeMember({ projectId, userId: member.user.id })}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Activity ── */}
      {activeTab === 'activity' && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Activity Log</h2>
          {logs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No activity yet</div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 bg-white rounded border border-gray-100 px-4 py-3"
                >
                  <Avatar name={log.performedBy.fullName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{log.performedBy.fullName}</span>{' '}
                      <span className="text-gray-600">{log.action}</span>
                      {log.oldValue && log.newValue && (
                        <span className="text-gray-500">
                          {' '}·{' '}
                          <span className="line-through text-red-400">{log.oldValue}</span>{' '}
                          → <span className="text-green-600">{log.newValue}</span>
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {showEditProject && (
        <Modal title="Edit Project" onClose={() => setShowEditProject(false)}>
          <ProjectForm
            defaultValues={project}
            onSubmit={handleUpdateProject}
            onCancel={() => setShowEditProject(false)}
            isLoading={updatingProject}
          />
        </Modal>
      )}

      {showCreateTask && (
        <Modal title="Create Task" onClose={() => setShowCreateTask(false)} size="lg">
          <TaskForm
            projectId={projectId}
            defaultValues={{ status: createTaskStatus }}
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateTask(false)}
            isLoading={creatingTask}
          />
        </Modal>
      )}

      {showCreateSprint && (
        <Modal title="Create Sprint" onClose={() => setShowCreateSprint(false)}>
          <SprintForm
            projectId={projectId}
            onSubmit={handleCreateSprint}
            onCancel={() => setShowCreateSprint(false)}
            isLoading={creatingSprint}
          />
        </Modal>
      )}

      {editSprintId && sprintToEdit && (
        <Modal title="Edit Sprint" onClose={() => setEditSprintId(null)}>
          <SprintForm
            projectId={projectId}
            defaultValues={sprintToEdit}
            onSubmit={handleUpdateSprint}
            onCancel={() => setEditSprintId(null)}
            isLoading={updatingSprint}
          />
        </Modal>
      )}

      {showAddMember && (
        <Modal title="Add Member" onClose={() => setShowAddMember(false)} size="sm">
          <AddMemberForm
            projectId={projectId}
            existingUserIds={members.map((m) => m.user.id)}
            allUsers={allUsers}
            onSubmit={async (data) => {
              await addMember({ projectId, body: data }).unwrap()
              setShowAddMember(false)
            }}
            onCancel={() => setShowAddMember(false)}
            isLoading={addingMember}
          />
        </Modal>
      )}

      {showDeleteProject && (
        <ConfirmDialog
          title="Delete Project"
          message={`Delete "${project.name}"? This will also delete all tasks and sprints.`}
          confirmLabel={deletingProject ? 'Deleting...' : 'Delete'}
          danger
          disabled={deletingProject}
          onConfirm={handleDeleteProject}
          onCancel={() => setShowDeleteProject(false)}
        />
      )}

      {deleteTaskId && (
        <ConfirmDialog
          title="Delete Task"
          message="Delete this task? This cannot be undone."
          confirmLabel={deletingTask ? 'Deleting...' : 'Delete'}
          danger
          disabled={deletingTask}
          onConfirm={handleDeleteTask}
          onCancel={() => setDeleteTaskId(null)}
        />
      )}

      {deleteSprintId && (
        <ConfirmDialog
          title="Delete Sprint"
          message="Delete this sprint? This cannot be undone."
          confirmLabel={deletingSprint ? 'Deleting...' : 'Delete'}
          danger
          disabled={deletingSprint}
          onConfirm={handleDeleteSprint}
          onCancel={() => setDeleteSprintId(null)}
        />
      )}

      {deleteMemberId && (
        <ConfirmDialog
          title="Remove Member"
          message="Remove this member from the project?"
          confirmLabel={removingMember ? 'Removing...' : 'Remove'}
          danger
          disabled={removingMember}
          onConfirm={handleRemoveMember}
          onCancel={() => setDeleteMemberId(null)}
        />
      )}
    </div>
  )
}

// ─── Add Member Form ──────────────────────────────────────────────────────────

interface AddMemberFormProps {
  projectId: number
  existingUserIds: number[]
  allUsers: User[]
  onSubmit: (data: ProjectMemberRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

function AddMemberForm({
  existingUserIds,
  allUsers,
  onSubmit,
  onCancel,
  isLoading,
}: AddMemberFormProps) {
  const { register, handleSubmit } = useForm<ProjectMemberRequest>({
    defaultValues: { roleInProject: 'MEMBER' },
  })
  const available = allUsers.filter((u) => !existingUserIds.includes(u.id))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">User *</label>
        <select
          {...register('userId', { required: true, valueAsNumber: true })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select user</option>
          {available.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName} ({u.role})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          {...register('roleInProject')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="LEAD">Lead</option>
          <option value="MEMBER">Member</option>
          <option value="REVIEWER">Reviewer</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  )
}
