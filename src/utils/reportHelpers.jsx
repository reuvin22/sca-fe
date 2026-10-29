import { countBy, percent } from './dashboardHelpers'
import { getCaseStatus } from './caseHelpers'

// Workload table and export columns
export const WORKLOAD_COLUMNS = [
  { id: 'staff', label: 'Counselor', width: 24, value: (row) => row.staff },
  { id: 'total', label: 'Total Appointments', width: 20, value: (row) => row.total },
  { id: 'scheduled', label: 'Scheduled', width: 14, value: (row) => row.scheduled },
  { id: 'completed', label: 'Completed', width: 14, value: (row) => row.completed },
  { id: 'cancelled', label: 'Cancelled', width: 14, value: (row) => row.cancelled },
  { id: 'noShow', label: 'No-show', width: 14, value: (row) => row.noShow },
]

// Appointments per month, oldest first: [{ month: 'Oct 2026', count, color }]
function appointmentsByMonth(appointments) {
  return countBy(appointments.map((item) => ({ month: item.date.slice(0, 7) })), 'month')
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(({ label, count }, i) => ({
      month: new Date(`${label}-01T00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count,
      color: i % 2 ? 'bg-fuchsia-600' : 'bg-emerald-500',
    }))
}

// Appointment counts per assigned staff, busiest first
function workloadByCounselor(appointments) {
  const count = (items, status) => items.filter((item) => item.status === status).length
  return countBy(appointments, 'staff').map(({ label }) => {
    const items = appointments.filter((item) => item.staff === label)
    return {
      id: label,
      staff: label,
      total: items.length,
      scheduled: count(items, 'scheduled'),
      completed: count(items, 'completed'),
      cancelled: count(items, 'cancelled'),
      noShow: count(items, 'no-show'),
    }
  })
}

// All report data, built from the Cases and Appointments lists
export function getReportData(cases, appointments) {
  const completedCases = cases.filter((item) => getCaseStatus(item) === 'accomplished').length
  const pendingCases = cases.length - completedCases
  const withFollowUp = cases.filter((item) => item.followUpDate)
  const followUpsDone = withFollowUp.filter((item) => getCaseStatus(item) === 'accomplished').length
  // Only appointments that already happened (completed or no-show)
  const noShows = appointments.filter((item) => item.status === 'no-show').length
  const finished = noShows + appointments.filter((item) => item.status === 'completed').length
  const referred = cases.filter((item) => item.referredTo && item.referredTo !== 'Not Referred')

  return {
    rates: [
      {
        label: 'Completed',
        note: `${completedCases} completed · ${pendingCases} pending`,
        value: percent(completedCases, cases.length),
        color: 'stroke-emerald-500',
      },
      {
        label: 'Follow-ups',
        note: `${followUpsDone} of ${withFollowUp.length} done`,
        value: percent(followUpsDone, withFollowUp.length),
        color: 'stroke-sky-400',
      },
      {
        label: 'No-show',
        note: `${noShows} of ${finished} appointments`,
        value: percent(noShows, finished),
        color: 'stroke-red-500',
      },
    ],
    caseStatus: [
      { label: 'Completed', count: completedCases },
      { label: 'Pending', count: pendingCases },
    ],
    appointmentsByMonth: appointmentsByMonth(appointments),
    referrals: countBy(referred, 'referredTo'),
    workload: workloadByCounselor(appointments),
  }
}
