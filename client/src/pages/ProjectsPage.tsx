import { useState } from 'react'
import { useGetAllProjectsQuery, useCreateProjectMutation, useDeleteProjectMutation } from '../api/projectsApi'
import type { ProjectRequest, ProjectStatus, Priority } from '../types'
import ProjectCard from '../features/projects/ProjectCard'
import ProjectForm from '../features/projects/ProjectForm'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import RequireRole from '../components/RequireRole'

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useGetAllProjectsQuery()
  const [createProject, { isLoading: creating }] = useCreateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('')

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.status === statusFilter
    const matchPriority = !priorityFilter || p.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  async function handleCreate(data: ProjectRequest) {
    await createProject(data).unwrap()
    setShowCreate(false)
  }

  async function handleDelete() {
    if (deleteId) {
      await deleteProject(deleteId).unwrap()
      setDeleteId(null)
    }
  }

  if (isLoading) return <Spinner className="mt-20" />

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">{projects.length} total projects</p>
        </div>
        <RequireRole roles={['ADMIN', 'MANAGER']}>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + New Project
          </button>
        </RequireRole>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '')}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="PLANNING">Planning</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
        {(search || statusFilter || priorityFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter('') }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear filters
          </button>
        )}
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} results</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📁"
          title="No projects found"
          description={search ? 'Try a different search term' : 'Create your first project to get started'}
          action={
            !search ? (
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                + New Project
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <div key={project.id} className="relative group">
              <ProjectCard project={project} />
              <RequireRole roles={['ADMIN', 'MANAGER']}>
                <button
                  onClick={(e) => { e.preventDefault(); setDeleteId(project.id) }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 transition-opacity"
                >
                  Delete
                </button>
              </RequireRole>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Create Project" onClose={() => setShowCreate(false)}>
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            isLoading={creating}
          />
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmDialog
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
