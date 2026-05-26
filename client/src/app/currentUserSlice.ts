import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../types'

interface CurrentUserState {
  user: User | null
}

const initialState: CurrentUserState = {
  user: null,
}

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    clearCurrentUser(state) {
      state.user = null
    },
  },
})

export const { setCurrentUser, clearCurrentUser } = currentUserSlice.actions
export default currentUserSlice.reducer
