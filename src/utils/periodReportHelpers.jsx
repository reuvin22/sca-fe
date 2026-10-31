import { FOLLOW_UP } from './caseHelpers'
import { formatDate } from './dateHelpers'

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i, 1).toLocaleString('en-US', { month: 'long' }),
}))

// Current year back to 2010, newest first
export const YEAR_OPTIONS = Array.from({ length: new Date().getFullYear() - 2009 }, (_, i) => {
  const year = String(new Date().getFullYear() - i)
  return { value: year, label: year }
})

// "October 2026" or "2026"
export const periodLabel = (year, month) => (month ? `${MONTH_OPTIONS[month - 1].label} ${year}` : String(year))

// Cases whose follow-up date is in the period (table and export columns)
export const DUE_CASE_COLUMNS = [
  { id: 'followUpDate', label: 'Due Date', width: 15, value: (row) => formatDate(row.followUpDate) },
  { id: 'caseNumber', label: 'Case No.', width: 18, value: (row) => row.caseNumber },
  { id: 'learnerName', label: 'Name of Learner', width: 26, value: (row) => row.learnerName },
  { id: 'gradeSection', label: 'Grade & Section', width: 20, value: (row) => row.gradeSection },
  { id: 'concern', label: 'Nature of Concern', width: 26, value: (row) => row.concern },
  {
    id: 'status',
    label: 'Status',
    width: 15,
    value: (row) => FOLLOW_UP[row.status]?.label ?? '',
    color: (row) => FOLLOW_UP[row.status]?.tone,
  },
]

// Summary as flat rows (Section | Item | Count) for the exports
export const SUMMARY_COLUMNS = [
  { id: 'section', label: 'Section', width: 22, value: (row) => row.section },
  { id: 'item', label: 'Item', width: 30, value: (row) => row.item },
  { id: 'count', label: 'Count', width: 10, value: (row) => row.count },
]

// Totals shown at the top of the summary
export const caseTotals = ({ cases, appointments, dueCases }) => [
  { label: 'New Cases', value: cases.total },
  { label: 'Accomplished', value: cases.accomplished },
  { label: 'Pending', value: cases.pending },
  { label: 'Overdue', value: cases.overdue },
  { label: 'Referred', value: cases.referred },
  { label: 'Follow-ups Due', value: dueCases.length },
  { label: 'Appointments', value: appointments.total },
]

// Count lists shown as bars and exported
export const countSections = (report) => [
  { title: 'By Classification', bars: report.classifications },
  { title: 'By Concern', bars: report.concerns },
  { title: 'By Grade & Section', bars: report.gradeSections },
  { title: 'Referrals', bars: report.referrals },
]

export function toSummaryRows(report) {
  const { appointments } = report
  const rows = [
    ...caseTotals(report).map(({ label, value }) => ({ section: 'Totals', item: label, count: value })),
    ...[
      ['Completed', appointments.completed],
      ['Scheduled', appointments.scheduled],
      ['Cancelled', appointments.cancelled],
      ['No-show', appointments.noShow],
    ].map(([item, count]) => ({ section: 'Appointments', item, count })),
    ...countSections(report).flatMap(({ title, bars }) =>
      bars.map(({ label, count }) => ({ section: title.replace('By ', ''), item: label, count })),
    ),
  ]
  return rows.map((row, i) => ({ ...row, id: i }))
}
