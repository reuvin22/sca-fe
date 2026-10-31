import api from '../api/axios'
import { tagsForUrl } from './dataSync'

// Drops empty filters so the URL only has the ones in use
export const cleanParams = (params) => Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''))

// One page of a list endpoint: { items, pagination }. The backend sends at most 15 per page.
export async function fetchPage(path, filters, page = 1) {
  const body = await api.get(path, { params: cleanParams({ ...filters, page }) })
  return { items: body.data, pagination: body.pagination }
}

// Every page of a list endpoint. Only for things that need the full list: exports, dropdowns, the calendar.
export async function fetchAllPages(path, filters = {}) {
  const first = await fetchPage(path, filters, 1)
  const pages = Array.from({ length: Math.max(first.pagination.totalPages - 1, 0) }, (_, i) =>
    fetchPage(path, filters, i + 2),
  )
  const rest = await Promise.all(pages)
  return [first, ...rest].flatMap((result) => result.items)
}

// CRUD service for a list endpoint. Used by usePaginatedList. `tags`: what to watch for changes (utils/dataSync).
export function createListService(path) {
  return {
    tags: tagsForUrl(path),
    list: (filters, page) => fetchPage(path, filters, page),
    listAll: (filters) => fetchAllPages(path, filters),
    get: async (id) => (await api.get(`${path}/${id}`)).data,
    create: async (data) => (await api.post(path, data)).data,
    update: async (data) => (await api.put(`${path}/${data.id}`, data)).data,
    remove: (id) => api.delete(`${path}/${id}`),
  }
}
