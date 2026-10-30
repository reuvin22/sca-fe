import { formatDate, formatTime, toDateString } from './dateHelpers'

// Notifications built from GET /reports/notifications. Only names, IDs and dates are shown
// (never counseling notes or remarks).
// Returns [{ id, title, message, to, className }], most urgent first.
export function getNotifications({ overdue, dueToday, upcomingAppointments, systemUpdates = [] }) {
  const today = toDateString()

  return [
    // System updates from the developers. `read` comes from the server; `updateId` marks them read there.
    ...systemUpdates.map((item) => ({
      id: `update-${item.id}`,
      updateId: item.id,
      read: item.read,
      title: `System update: ${item.title}`,
      message: `${item.reportType === 'bug' ? 'Bug fix' : 'New feature'} · ${formatDate(item.publishedAt.slice(0, 10))}`,
      to: `/updates/${item.id}`,
      className: 'bg-brand-500',
    })),
    ...overdue.map((item) => ({
      id: `overdue-${item.id}`,
      title: 'Follow-up overdue',
      message: `${item.learnerName} · ${item.caseNumber} · ${formatDate(item.followUpDate)}`,
      to: '/cases',
      className: 'bg-red-500',
    })),
    ...dueToday.map((item) => ({
      id: `today-${item.id}`,
      title: 'Follow-up due today',
      message: `${item.learnerName} · ${item.caseNumber}`,
      to: '/cases',
      className: 'bg-orange-500',
    })),
    ...upcomingAppointments.map((item) => ({
      id: `appointment-${item.id}`,
      title: `Appointment ${item.date === today ? 'today' : 'tomorrow'} at ${formatTime(item.time)}`,
      message: `${item.studentName}${item.staff ? ` · ${item.staff}` : ''}`,
      to: '/appointments',
      className: 'bg-sky-500',
    })),
  ]
}
