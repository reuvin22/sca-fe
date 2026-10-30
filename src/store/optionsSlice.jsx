import { createSlice } from '@reduxjs/toolkit'

// Settings categories: [{ id, name, options }]. Loaded from the backend after sign-in.
// Category names must match form labels to show as dropdowns.
const optionsSlice = createSlice({
  name: 'options',
  initialState: { categories: [] },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload)
    },
    // Replaces a category with the saved version from the backend
    updateCategory: (state, action) => {
      state.categories = state.categories.map((category) =>
        category.id === action.payload.id ? action.payload : category,
      )
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload)
    },
  },
})

export const { setCategories, addCategory, updateCategory, removeCategory } = optionsSlice.actions
export default optionsSlice.reducer
