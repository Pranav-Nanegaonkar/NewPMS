import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '../api/baseApi'
import currentUserReducer from './currentUserSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    currentUser: currentUserReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
