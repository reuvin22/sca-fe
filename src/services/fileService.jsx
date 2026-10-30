import api from '../api/axios'
import { FILES_ROUTE } from '../api/routes'
import { fetchAllPages, fetchPage } from '../utils/apiHelpers'

const UPLOAD_TIMEOUT = 120000 // big files can take longer than normal requests

// Used by usePaginatedList. Files can't be edited, so there is no update.
export const fileService = {
  list: (filters, page) => fetchPage(FILES_ROUTE, filters, page),
  listAll: (filters) => fetchAllPages(FILES_ROUTE, filters),
  // `file` is a browser File from an <input type="file"> or drop
  create: async (file) => {
    const form = new FormData()
    form.append('file', file)
    return (await api.post(FILES_ROUTE, form, { timeout: UPLOAD_TIMEOUT })).data
  },
  remove: (id) => api.delete(`${FILES_ROUTE}/${id}`),
}

// Downloads the file content (needs the login token, so a plain link can't be used).
// Returns a temporary URL; call URL.revokeObjectURL(url) when done with it.
export async function getFileUrl(file) {
  const blob = await api.get(`${FILES_ROUTE}/${file.id}/download`, { responseType: 'blob', timeout: UPLOAD_TIMEOUT })
  return URL.createObjectURL(blob)
}

// Saves the file to the user's computer
export async function downloadFile(file) {
  const url = await getFileUrl(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
  URL.revokeObjectURL(url)
}
