import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User, UserRole } from '../types'
import type { RootState } from './store'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const { setCredentials, logout, setLoading, setError } = authSlice.actions
export default authSlice.reducer

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthToken = (state: RootState) => state.auth.token
export const selectAuthLoading = (state: RootState) => state.auth.isLoading
export const selectAuthError = (state: RootState) => state.auth.error
export const selectUserRoles = (state: RootState) => state.auth.user?.roles ?? []

export const selectHasRole = (role: UserRole) => (state: RootState) =>
  state.auth.user?.role === role

export const selectHasAnyRole = (roles: UserRole[]) => (state: RootState) =>
  state.auth.user ? roles.includes(state.auth.user.role) : false
