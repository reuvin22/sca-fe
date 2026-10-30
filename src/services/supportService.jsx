import api from '../api/axios'
import { SUPPORT_ROUTE } from '../api/routes'
import { UPLOAD_TIMEOUT, toFormData } from '../utils/formData'

// `request`: { type: 'bug' | 'feature', subject, description, severity? }
// `severity` ('low' | 'medium' | 'high' | 'critical') and `files` (images/videos) are only sent for bugs
export async function sendSupportRequest(request, files = []) {
  return (await api.post(SUPPORT_ROUTE, toFormData(request, files), { timeout: UPLOAD_TIMEOUT })).data
}

// Developers: every report of one type ('bug' | 'feature') for the Kanban board
export async function getReportBoard(type) {
  return (await api.get(`${SUPPORT_ROUTE}/board`, { params: { type } })).data
}

// Developers: `changes` is { status?, assigneeId? } (assigneeId null = unassigned)
export async function updateReport(id, changes) {
  return (await api.patch(`${SUPPORT_ROUTE}/${id}`, changes)).data
}

// Developers: a report's image/video as a temporary URL (revoke it when done)
export async function getReportAttachmentUrl(reportId, index) {
  const blob = await api.get(`${SUPPORT_ROUTE}/${reportId}/attachments/${index}`, { responseType: 'blob', timeout: UPLOAD_TIMEOUT })
  return URL.createObjectURL(blob)
}

// Developers: one report with everything shown on the board (reporter, column, assignee, review)
export async function getReport(id) {
  return (await api.get(`${SUPPORT_ROUTE}/${id}`)).data
}
