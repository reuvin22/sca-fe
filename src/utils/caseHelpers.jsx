import { toISO } from './dateHelpers'

// Date as "YYYY-MM-DD" in local time. `offset` is days from today.
export const toDateString = (offset = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return toISO(date)
}

const random4 = () => String(Math.floor(Math.random() * 10000)).padStart(4, '0')

// e.g. CASE#1234-9808
export const generateCaseNumber = () => `CASE#${random4()}-${random4()}`

export const FOLLOW_UP = {
  overdue: { label: 'Overdue', className: 'bg-red-100 text-red-700' },
  today: { label: 'Due Today', className: 'bg-orange-100 text-orange-700' },
  scheduled: { label: 'Scheduled', className: 'bg-sky-100 text-sky-700' },
}

export function getFollowUpStatus(followUpDate) {
  const today = toDateString()
  if (followUpDate < today) return 'overdue'
  if (followUpDate === today) return 'today'
  return 'scheduled'
}

// No `to` means a single day (`from` only).
export function filterCases(cases, { search, from, to, status }) {
  const keyword = search.trim().toLowerCase()
  return cases.filter(
    (item) =>
      item.studentName.toLowerCase().includes(keyword) &&
      (!from || (item.date >= from && item.date <= (to || from))) &&
      (!status || getFollowUpStatus(item.followUpDate) === status),
  )
}
