import type { ReactNode } from 'react'
import { useHasAnyRole } from '../hooks/useAuth'
import type { UserRole } from '../types'

interface RequireRoleProps {
  roles: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

export default function RequireRole({ roles, children, fallback = null }: RequireRoleProps) {
  const hasRole = useHasAnyRole(roles)
  return hasRole ? <>{children}</> : <>{fallback}</>
}
