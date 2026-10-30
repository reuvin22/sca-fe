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

// Feature request review (developers set it; only approved requests can be voted on).
// `className` is the badge; `card` colors the whole card (see-through tints so dark mode stays readable).
export const REVIEW = {
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700', card: 'border-green-500/50 bg-green-500/10' },
  'under-review': {
    label: 'Under Review',
    className: 'bg-orange-100 text-orange-700',
    card: 'border-orange-500/50 bg-orange-500/10',
  },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700', card: 'border-red-500/50 bg-red-500/10' },
}

export const REVIEW_OPTIONS = Object.entries(REVIEW).map(([value, { label }]) => ({ value, label }))

// "All" = approved + under review (rejected requests only show with their own filter)
const ALL_FILTER = { value: 'all', label: 'All' }

// Feature Requests page: All sits beside Rejected
export const FEATURE_FILTERS = [...REVIEW_OPTIONS, ALL_FILTER]

// Developers' Feature Review page: requests waiting for a decision come first
export const REVIEW_PAGE_FILTERS = [
  { value: 'under-review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  ALL_FILTER,
]

// Second filter under Approved: where the work is on the developer board ('' = all approved).
// Done = built; write the update that notifies users from there.
export const PROGRESS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'todo', label: 'In Queue' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

// Progress badge for approved feature requests (Done shows "Released" once the update is published)
export const PROGRESS = {
  todo: { label: 'In Queue', className: 'bg-gray-100 text-gray-600' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
  done: { label: '✓ Done', className: 'bg-indigo-100 text-indigo-700' },
  released: { label: '✓ Released', className: 'bg-teal-100 text-teal-700' },
}

export const REPORT_TYPE = {
  bug: { label: 'Bug', className: 'bg-red-100 text-red-700' },
  feature: { label: 'Feature', className: 'bg-sky-100 text-sky-700' },
}
