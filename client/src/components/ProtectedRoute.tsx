import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppSelector } from '../app/hooks'
import { selectIsAuthenticated } from '../app/authSlice'

interface ProtectedRouteProps {
  children?: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // When used as a layout route (no children), render nested routes via Outlet
  return children ? <>{children}</> : <Outlet />
}
