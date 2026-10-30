// Developer Reports board (Contact Support messages)

export const REPORT_TABS = [
  { id: 'bug', label: 'Bugs' },
  { id: 'feature', label: 'Feature Requests' },
]

// Kanban columns (same ids as the backend's report status)
export const REPORT_COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

export const REPORT_STATUS_OPTIONS = REPORT_COLUMNS.map(({ id, title }) => ({ value: id, label: title }))

export const SEVERITY = {
  low: { label: 'Low', className: 'bg-sky-100 text-sky-700' },
  medium: { label: 'Medium', className: 'bg-amber-100 text-amber-700' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700' },
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700' },
}

// Feature request review (developers set it; only approved requests can be voted on)
export const REVIEW = {
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
  'under-review': { label: 'Under Review', className: 'bg-amber-100 text-amber-700' },
  rejected: { label: 'Rejected', className: 'bg-gray-100 text-gray-600' },
}

export const REVIEW_OPTIONS = Object.entries(REVIEW).map(([value, { label }]) => ({ value, label }))

export const REPORT_TYPE = {
  bug: { label: 'Bug', className: 'bg-red-100 text-red-700' },
  feature: { label: 'Feature', className: 'bg-sky-100 text-sky-700' },
}
