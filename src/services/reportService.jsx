import api from '../api/axios'
import { REPORT_ROUTES } from '../api/routes'

// Counts for the dashboard charts (see utils/dashboardHelpers)
export async function getDashboard() {
  return (await api.get(REPORT_ROUTES.dashboard)).data
}

// Counts for the Reports page (see utils/reportHelpers)
export async function getReportSummary() {
  return (await api.get(REPORT_ROUTES.summary)).data
}

// { overdue, dueToday, upcomingAppointments } (see utils/notificationHelpers)
export async function getNotificationData() {
  return (await api.get(REPORT_ROUTES.notifications)).data
}
