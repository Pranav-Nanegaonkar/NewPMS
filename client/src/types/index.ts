// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'MANAGER' | 'DEVELOPER' | 'TESTER'
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED'
export type TaskType = 'FEATURE' | 'BUG' | 'IMPROVEMENT' | 'DOCUMENTATION'
export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED'
export type ProjectMemberRole = 'LEAD' | 'MEMBER' | 'REVIEWER'

// ─── API Wrapper ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface User {
  id: number
  fullName: string
  email: string
  role: UserRole
  roles?: string[]
  department: string
  enabled?: boolean
  accountNonLocked?: boolean
  createdAt: string
  updatedAt: string
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupRequest {
  fullName: string
  email: string
  password: string
  role: UserRole
  department?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Project {
  id: number
  name: string
  description: string
  status: ProjectStatus
  priority: Priority
  startDate: string
  endDate: string
  owner: User
  memberCount: number
  taskCount: number
  createdAt: string
  updatedAt: string
}

export interface ProjectMember {
  id: number
  projectId: number
  user: User
  roleInProject: ProjectMemberRole
  joinedAt: string
}

export interface Sprint {
  id: number
  projectId: number
  projectName: string
  name: string
  goal: string
  status: SprintStatus
  startDate: string
  endDate: string
  taskCount: number
  completedStoryPoints: number
  createdAt: string
}

export interface Task {
  id: number
  projectId: number
  projectName: string
  sprintId: number | null
  sprintName: string | null
  parentTaskId: number | null
  title: string
  description: string
  type: TaskType
  status: TaskStatus
  priority: Priority
  assignee: User | null
  reporter: User
  storyPoints: number | null
  dueDate: string | null
  commentCount: number
  subTasks: Task[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: number
  taskId: number
  author: User
  content: string
  createdAt: string
  updatedAt: string
}

export interface ActivityLog {
  id: number
  projectId: number
  taskId: number | null
  performedBy: User
  action: string
  oldValue: string | null
  newValue: string | null
  createdAt: string
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface ProjectRequest {
  name: string
  description?: string
  status: ProjectStatus
  priority: Priority
  startDate?: string
  endDate?: string
  ownerId: number
}

export interface TaskRequest {
  projectId: number
  sprintId?: number | null
  parentTaskId?: number | null
  title: string
  description?: string
  type: TaskType
  status: TaskStatus
  priority: Priority
  assigneeId?: number | null
  reporterId: number
  storyPoints?: number | null
  dueDate?: string | null
}

export interface SprintRequest {
  projectId: number
  name: string
  goal?: string
  status: SprintStatus
  startDate?: string
  endDate?: string
}

export interface ProjectMemberRequest {
  userId: number
  roleInProject: ProjectMemberRole
}

export interface CommentRequest {
  taskId: number
  authorId: number
  content: string
}

export interface UserRequest {
  fullName: string
  email: string
  role: UserRole
  department?: string
}

export interface Project {
  id: number
  name: string
  description: string
  status: ProjectStatus
  priority: Priority
  startDate: string
  endDate: string
  owner: User
  memberCount: number
  taskCount: number
  createdAt: string
  updatedAt: string
}

export interface ProjectMember {
  id: number
  projectId: number
  user: User
  roleInProject: ProjectMemberRole
  joinedAt: string
}

export interface Sprint {
  id: number
  projectId: number
  projectName: string
  name: string
  goal: string
  status: SprintStatus
  startDate: string
  endDate: string
  taskCount: number
  completedStoryPoints: number
  createdAt: string
}

export interface Task {
  id: number
  projectId: number
  projectName: string
  sprintId: number | null
  sprintName: string | null
  parentTaskId: number | null
  title: string
  description: string
  type: TaskType
  status: TaskStatus
  priority: Priority
  assignee: User | null
  reporter: User
  storyPoints: number | null
  dueDate: string | null
  commentCount: number
  subTasks: Task[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: number
  taskId: number
  author: User
  content: string
  createdAt: string
  updatedAt: string
}

export interface ActivityLog {
  id: number
  projectId: number
  taskId: number | null
  performedBy: User
  action: string
  oldValue: string | null
  newValue: string | null
  createdAt: string
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface ProjectRequest {
  name: string
  description?: string
  status: ProjectStatus
  priority: Priority
  startDate?: string
  endDate?: string
  ownerId: number
}

export interface TaskRequest {
  projectId: number
  sprintId?: number | null
  parentTaskId?: number | null
  title: string
  description?: string
  type: TaskType
  status: TaskStatus
  priority: Priority
  assigneeId?: number | null
  reporterId: number
  storyPoints?: number | null
  dueDate?: string | null
}

export interface SprintRequest {
  projectId: number
  name: string
  goal?: string
  status: SprintStatus
  startDate?: string
  endDate?: string
}

export interface ProjectMemberRequest {
  userId: number
  roleInProject: ProjectMemberRole
}

export interface CommentRequest {
  taskId: number
  authorId: number
  content: string
}

export interface UserRequest {
  fullName: string
  email: string
  role: UserRole
  department?: string
}
