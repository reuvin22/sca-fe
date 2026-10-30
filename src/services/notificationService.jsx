import api from '../api/axios'

// Saves which bell notifications were read (ids like "overdue-<caseId>"), so they stay read
// after a reload and on other devices
export function markNotificationsRead(ids) {
  return api.post('/notifications/read', { ids })
}
