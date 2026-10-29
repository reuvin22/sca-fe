// Mock storage. Files stay in browser memory until refresh.
// Replace with real upload/download API calls when the backend is ready.
import { toDateString } from '../utils/dateHelpers'
import { delay } from '../utils/mockApi'

let files = []

export async function getFiles() {
  await delay()
  return [...files]
}

// `file` is a browser File from an <input type="file"> or drop
export async function uploadFile(file) {
  await delay()
  const uploaded = {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    uploadedAt: toDateString(),
    url: URL.createObjectURL(file),
  }
  files = [uploaded, ...files]
  return uploaded
}

export async function deleteFile(id) {
  await delay()
  const file = files.find((item) => item.id === id)
  if (file) URL.revokeObjectURL(file.url)
  files = files.filter((item) => item.id !== id)
  return id
}

// Used by useCrud
export const fileService = {
  getAll: getFiles,
  create: uploadFile,
  remove: deleteFile,
}
