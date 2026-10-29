import { createSlice } from '@reduxjs/toolkit'
import { loadTheme } from '../utils/themeHelpers'

const uiSlice = createSlice({
  name: 'ui',
  // Start collapsed on small screens
  initialState: { sidebarCollapsed: window.innerWidth < 768, ...loadTheme() },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    // 'light' | 'dark'
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    // Palette id, or null for default colors
    setPalette: (state, action) => {
      state.palette = action.payload
    },
  },
})

export const { toggleSidebar, setTheme, setPalette } = uiSlice.actions
export default uiSlice.reducer
