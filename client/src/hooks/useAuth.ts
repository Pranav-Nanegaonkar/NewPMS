import { useAppSelector } from '../app/hooks'
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectHasRole,
  selectHasAnyRole,
} from '../app/authSlice'
import type { UserRole } from '../types'

export function useAuth() {
  const user = useAppSelector(selectCurrentUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return { user, isAuthenticated }
}

export function useHasRole(role: UserRole): boolean {
  return useAppSelector(selectHasRole(role))
}

export function useHasAnyRole(roles: UserRole[]): boolean {
  return useAppSelector(selectHasAnyRole(roles))
}
