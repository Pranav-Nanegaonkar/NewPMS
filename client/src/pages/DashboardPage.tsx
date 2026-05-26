import { Link } from 'react-router-dom'
import { useGetAllProjectsQuery } from '../api/projectsApi'
import { useGetAllTasksQuery } from '../api/tasksApi'
import { useGetAllUsersQuery } from '../api/usersApi'
import { useAppSelector } from '../app/hooks'
import Spinner from '../components/Spinner'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import { taskStatusColor, taskStatusLabel, priorityColor, projectStatusColor, projectStatusLabel } from '../utils/enumColors'
import { formatDate, timeAgo } from '../utils/format'

export default function DashboardPage() {
  const currentUser = useAppSelector((s) => s.currentUser.user)
  const { data: projects = [], isLoading: loadingProjects } = useGetAllProjectsQuery()
  const { data: tasks = [], isLoading: loadingTasks } = useGetAllTasksQuery()
  const { data: users = [] } = useGetAllUsersQuery()

  const myTasks = currentUser ? tasks.filter((t) => t.assignee?.id === currentUser.id) : []
  const activeTasks = tasks.filter((t) => t.status === 'IN_PROGRESS')
  const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED')
  const doneTasks = tasks.filter((t) => t.status === 'DONE')
  const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS')

  if (loadingProjects || loadingTasks) return <Spinner className="mt-20" />

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {currentUser ? `Welcome, ${currentUser.fullName.split(' ')[0]} 👋` : 'Dashboard'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening across your projects.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: activeProjects.length, icon: '📁', color: 'text-blue-600' },
          { label: 'In Progress', value: activeTasks.length, icon: '⚡', color: 'text-orange-500' },
          { label: 'Blocked', value: blockedTasks.length, icon: '🚫', color: 'text-red-500' },
          { label: 'Completed', value: doneTasks.length, icon: '✅', color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">My Tasks</h2>
            <span className="text-xs text-gray-500">{myTasks.length} tasks</span>
          </div>
          <div className="divide-y divide-gray-50">
            {myTasks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No tasks assigned to you</p>
            ) : (
              myTasks.slice(0, 8).map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Badge
                    label={taskStatusLabel[task.status]}
                    className={`flex-shrink-0 ${taskStatusColor[task.status]}`}
                  />
                  <span className="text-sm text-gray-800 flex-1 truncate">{task.title}</span>
                  <Badge label={task.priority} className={`flex-shrink-0 ${priorityColor[task.priority]}`} />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Active Projects</h2>
            <Link to="/projects" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {activeProjects.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No active projects</p>
            ) : (
              activeProjects.slice(0, 6).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                    <p className="text-xs text-gray-500">
                      {project.taskCount} tasks · {project.memberCount} members
                    </p>
                  </div>
                  <Badge
                    label={projectStatusLabel[project.status]}
                    className={projectStatusColor[project.status]}
                  />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Team</h2>
            <Link to="/users" className="text-xs text-blue-600 hover:underline">Manage</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {users.slice(0, 6).map((user) => (
              <div key={user.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={user.fullName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.department}</p>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{user.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Recent Tasks</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {tasks.slice(0, 6).map((task) => (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{task.title}</p>
                  <p className="text-xs text-gray-400">{task.projectName} · {timeAgo(task.createdAt)}</p>
                </div>
                <Badge
                  label={taskStatusLabel[task.status]}
                  className={taskStatusColor[task.status]}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
