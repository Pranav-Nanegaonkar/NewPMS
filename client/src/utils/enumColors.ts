import type { Priority, TaskStatus, ProjectStatus, SprintStatus, TaskType, UserRole } from '../types'

export const priorityColor: Record<Priority, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
}

export const priorityDot: Record<Priority, string> = {
  LOW: 'bg-gray-400',
  MEDIUM: 'bg-blue-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-600',
}

export const taskStatusColor: Record<TaskStatus, string> = {
  TODO: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  IN_REVIEW: 'bg-purple-100 text-purple-700',
  DONE: 'bg-green-100 text-green-700',
  BLOCKED: 'bg-red-100 text-red-700',
}

export const taskStatusLabel: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
  BLOCKED: 'Blocked',
}

export const projectStatusColor: Record<ProjectStatus, string> = {
  PLANNING: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  ON_HOLD: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export const projectStatusLabel: Record<ProjectStatus, string> = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export const sprintStatusColor: Record<SprintStatus, string> = {
  PLANNED: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
}

export const taskTypeColor: Record<TaskType, string> = {
  FEATURE: 'bg-green-100 text-green-700',
  BUG: 'bg-red-100 text-red-700',
  IMPROVEMENT: 'bg-blue-100 text-blue-700',
  DOCUMENTATION: 'bg-gray-100 text-gray-600',
}

export const taskTypeIcon: Record<TaskType, string> = {
  FEATURE: '✦',
  BUG: '🐛',
  IMPROVEMENT: '↑',
  DOCUMENTATION: '📄',
}

export const userRoleColor: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  MANAGER: 'bg-purple-100 text-purple-700',
  DEVELOPER: 'bg-blue-100 text-blue-700',
  TESTER: 'bg-green-100 text-green-700',
}
