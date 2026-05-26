import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import TaskDetailPage from './pages/TaskDetailPage'
import UsersPage from './pages/UsersPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { useAppDispatch } from './app/hooks'
import { setCredentials, logout } from './app/authSlice'
import { tokenStorage } from './utils/tokenStorage'
import type { UserRole } from './types'

function parseJwt(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export default function App() {
  const dispatch = useAppDispatch()

  // Restore session on app load from stored token
  useEffect(() => {
    const token = tokenStorage.get()
    if (!token) return

    const payload = parseJwt(token)
    if (!payload) {
      tokenStorage.remove()
      return
    }

    const isExpired = typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()
    if (isExpired) {
      tokenStorage.remove()
      dispatch(logout())
      return
    }

    // Validate with backend then restore session
    fetch('/api/v1/auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token')
        const user = {
          id: payload.userId as number,
          email: payload.email as string,
          fullName: payload.email as string,
          role: ((payload.roles as string[])?.[0] ?? 'DEVELOPER') as UserRole,
          department: '',
          createdAt: '',
          updatedAt: '',
        }
        dispatch(setCredentials({ user, token }))
      })
      .catch(() => {
        tokenStorage.remove()
        dispatch(logout())
      })
  }, [dispatch])

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected routes — AppLayout provides the shell with Sidebar + Navbar */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="tasks/:id" element={<TaskDetailPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
