import api from '../api/axios'
import { CATEGORIES_ROUTE } from '../api/routes'
import { fetchAllPages } from '../utils/apiHelpers'

// Settings dropdown categories: [{ id, name, options }]
export const getCategories = () => fetchAllPages(CATEGORIES_ROUTE)

export async function createCategory(name) {
  return (await api.post(CATEGORIES_ROUTE, { name })).data
}

// Replaces the category's whole options list
export async function updateOptions(id, options) {
  return (await api.patch(`${CATEGORIES_ROUTE}/${id}/options`, { options })).data
}

export const deleteCategory = (id) => api.delete(`${CATEGORIES_ROUTE}/${id}`)

export async function renameCategory(id, name) {
  return (await api.patch(`${CATEGORIES_ROUTE}/${id}`, { name })).data
}
