import { percent } from './dashboardHelpers'

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
const toMonthBars = (months) =>
  months.map(({ month, count }, i) => ({
    month: new Date(`${month}-01T00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    count,
    color: i % 2 ? 'bg-fuchsia-600' : 'bg-emerald-500',
  }))

// All report data, built from GET /reports/summary
export function getReportData({ cases, appointmentStatus, appointmentsByMonth, referrals, workload }) {
  // Every case has a follow-up date, so follow-ups done = completed cases
  // No-show rate only counts appointments that already happened (completed or no-show)
  const finished = appointmentStatus.noShow + appointmentStatus.completed

  return {
    rates: [
      {
        label: 'Completed',
        note: `${cases.completed} completed · ${cases.pending} pending`,
        value: percent(cases.completed, cases.total),
        color: 'stroke-emerald-500',
      },
      {
        label: 'Follow-ups',
        note: `${cases.completed} of ${cases.total} done`,
        value: percent(cases.completed, cases.total),
        color: 'stroke-sky-400',
      },
      {
        label: 'No-show',
        note: `${appointmentStatus.noShow} of ${finished} appointments`,
        value: percent(appointmentStatus.noShow, finished),
        color: 'stroke-red-500',
      },
    ],
    caseStatus: [
      { label: 'Completed', count: cases.completed },
      { label: 'Pending', count: cases.pending },
    ],
    appointmentsByMonth: toMonthBars(appointmentsByMonth),
    referrals,
    workload: workload.map((row) => ({ ...row, id: row.staff })),
  }
}
