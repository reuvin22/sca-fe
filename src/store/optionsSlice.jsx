import { createSlice, nanoid } from '@reduxjs/toolkit'

const findCategory = (state, id) => state.categories.find((category) => category.id === id)

const optionsSlice = createSlice({
  name: 'options',
  initialState: {
    categories: [{ id: 'sex', name: 'Sex', options: ['Male', 'Female', 'Not provided'] }],
  },
  reducers: {
    addCategory: (state, action) => {
      state.categories.push({ id: nanoid(), name: action.payload, options: [] })
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload)
    },
    addOption: (state, action) => {
      const { categoryId, option } = action.payload
      findCategory(state, categoryId).options.push(option)
    },
    removeOption: (state, action) => {
      const { categoryId, option } = action.payload
      const category = findCategory(state, categoryId)
      category.options = category.options.filter((item) => item !== option)
    },
  },
})

export const { addCategory, removeCategory, addOption, removeOption } = optionsSlice.actions
export default optionsSlice.reducer
