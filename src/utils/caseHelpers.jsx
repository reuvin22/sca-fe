import { formatDate, toDateString } from './dateHelpers'

// Case fields shown in the table and modal. Fields without a `type` are dropdowns
// when a Settings category matches the label.
export const CASE_DROPDOWNS = [
  // Picks from Settings → Student Name (repeat cases), a new name is added there
  { id: 'learnerName', label: 'Name of Learner', category: 'Student Name' },
  { id: 'gradeSection', label: 'Grade & Section' },
  { id: 'concern', label: 'Nature of Concern' },
  { id: 'action', label: 'Action / Service Rendered' },
  { id: 'referredTo', label: 'Referred To / Remarks' },
  { id: 'classification', label: 'Intake Classification' },
]

// `tone` colors the status cell in exports (see utils/export/exportTheme)
// `accent` is the card border and title color
export const FOLLOW_UP = {
  overdue: {
    label: 'Overdue',
    className: 'bg-red-100 text-red-700',
    tone: 'red',
    accent: 'border-l-red-500 text-red-600',
  },
  today: {
    label: 'Due Today',
    className: 'bg-orange-100 text-orange-700',
    tone: 'orange',
    accent: 'border-l-orange-500 text-orange-600',
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-sky-100 text-sky-700',
    tone: 'sky',
    accent: 'border-l-sky-500 text-sky-600',
  },
  accomplished: {
    label: 'Accomplished',
    className: 'bg-green-100 text-green-700',
    tone: 'green',
    accent: 'border-l-green-500 text-green-600',
  },
}

export const STATUS_OPTIONS = Object.entries(FOLLOW_UP).map(([value, { label }]) => ({ value, label }))

// Table and export columns (plain text). The table adds badges/styles on top.
export const CASE_COLUMNS = [
  { id: 'caseNumber', label: 'Case No.', width: 18, value: (item) => item.caseNumber },
  { id: 'intakeDate', label: 'Intake Date', width: 14, value: (item) => formatDate(item.intakeDate) },
  ...CASE_DROPDOWNS.map(({ id, label }) => ({ id, label, width: 24, value: (item) => item[id] })),
  {
    id: 'followUpDate',
    label: 'Follow-up Date',
    width: 15,
    value: (item) => (item.followUpDate ? formatDate(item.followUpDate) : ''),
  },
  { id: 'remarks', label: 'Remarks', width: 40, value: (item) => item.remarks },
  {
    id: 'status',
    label: 'Status',
    width: 15,
    value: (item) => FOLLOW_UP[getCaseStatus(item)]?.label ?? '',
    color: (item) => FOLLOW_UP[getCaseStatus(item)]?.tone,
  },
]

export function getFollowUpStatus(followUpDate) {
  const today = toDateString()
  if (followUpDate < today) return 'overdue'
  if (followUpDate === today) return 'today'
  return 'scheduled'
}

// Status set in the modal wins; otherwise it's based on the follow-up date.
export function getCaseStatus(item) {
  if (item.status) return item.status
  return item.followUpDate ? getFollowUpStatus(item.followUpDate) : ''
}

export const CASE_STAT_LABELS = {
  total: 'Total Cases',
  forFollowUp: 'For Follow-up',
  overdue: 'Overdue',
  closed: 'Closed / Resolved',
  thisMonth: 'This Month',
  referrals: 'Referrals',
}
