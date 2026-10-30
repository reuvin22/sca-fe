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

export const REPORT_TYPE = {
  bug: { label: 'Bug', className: 'bg-red-100 text-red-700' },
  feature: { label: 'Feature', className: 'bg-sky-100 text-sky-700' },
}
