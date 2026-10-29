import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './uiSlice'
import optionsReducer from './optionsSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    options: optionsReducer,
    auth: authReducer,
  },
})
