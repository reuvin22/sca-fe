import api from '../api/axios'
import { UPDATES_ROUTE } from '../api/routes'
import { UPLOAD_TIMEOUT, toFormData } from '../utils/formData'

// Developers: done reports, with `updateId` once an update was published
export async function getDoneTasks() {
  return (await api.get(`${UPDATES_ROUTE}/tasks`)).data
}

// Developers: "This task is implemented". `content` is the editor's HTML; `files` are images/videos.
export async function publishUpdate(reportId, content, files) {
  return (await api.post(UPDATES_ROUTE, toFormData({ reportId, content }, files), { timeout: UPLOAD_TIMEOUT })).data
}

// Everyone: one published update (opened from a notification)
export async function getUpdate(id) {
  return (await api.get(`${UPDATES_ROUTE}/${id}`)).data
}

// An update's image/video as a temporary URL (revoke it when done)
export async function getUpdateMediaUrl(updateId, index) {
  const blob = await api.get(`${UPDATES_ROUTE}/${updateId}/media/${index}`, { responseType: 'blob', timeout: UPLOAD_TIMEOUT })
  return URL.createObjectURL(blob)
}

// Stops the update from showing as unread in notifications
export function markUpdateRead(id) {
  return api.post(`${UPDATES_ROUTE}/${id}/read`)
}
