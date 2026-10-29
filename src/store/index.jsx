import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './uiSlice'
import optionsReducer from './optionsSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    options: optionsReducer,
  },
})
