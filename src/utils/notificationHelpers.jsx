import { getCaseStatus } from './caseHelpers'
import { formatDate, formatTime, toDateString } from './dateHelpers'

// Notifications built from existing data. Only names, IDs and dates are shown
// (never counseling notes or remarks).
// Returns [{ id, title, message, to, className }], most urgent first.
export function getNotifications(cases, appointments) {
  const today = toDateString()
  const tomorrow = toDateString(1)

  const overdue = cases
    .filter((item) => getCaseStatus(item) === 'overdue')
    .map((item) => ({
      id: `overdue-${item.id}`,
      title: 'Follow-up overdue',
      message: `${item.learnerName} · ${item.caseNumber} · ${formatDate(item.followUpDate)}`,
      to: '/cases',
      className: 'bg-red-500',
    }))

  const dueToday = cases
    .filter((item) => getCaseStatus(item) === 'today')
    .map((item) => ({
      id: `today-${item.id}`,
      title: 'Follow-up due today',
      message: `${item.learnerName} · ${item.caseNumber}`,
      to: '/cases',
      className: 'bg-orange-500',
    }))

  const upcoming = appointments
    .filter((item) => item.status === 'scheduled' && (item.date === today || item.date === tomorrow))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .map((item) => ({
      id: `appointment-${item.id}`,
      title: `Appointment ${item.date === today ? 'today' : 'tomorrow'} at ${formatTime(item.time)}`,
      message: `${item.studentName}${item.staff ? ` · ${item.staff}` : ''}`,
      to: '/appointments',
      className: 'bg-sky-500',
    }))

  return [...overdue, ...dueToday, ...upcoming]
}
