import { Link } from 'react-router-dom'
import type { Project } from '../../types'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import { priorityColor, projectStatusColor, projectStatusLabel } from '../../utils/enumColors'
import { formatDate } from '../../utils/format'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
          {project.name}
        </h3>
        <Badge
          label={projectStatusLabel[project.status]}
          className={`ml-2 flex-shrink-0 ${projectStatusColor[project.status]}`}
        />
      </div>

      {project.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <Badge label={project.priority} className={priorityColor[project.priority]} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span>👥 {project.memberCount}</span>
          <span>✓ {project.taskCount} tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <Avatar name={project.owner.fullName} size="sm" />
          <span>{project.owner.fullName}</span>
        </div>
      </div>

      {(project.startDate || project.endDate) && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
          {formatDate(project.startDate)} → {formatDate(project.endDate)}
        </div>
      )}
    </Link>
  )
}
