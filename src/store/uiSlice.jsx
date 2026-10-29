import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  // Start collapsed on small screens
  initialState: { sidebarCollapsed: window.innerWidth < 768 },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
  },
})

export const { toggleSidebar } = uiSlice.actions
export default uiSlice.reducer
