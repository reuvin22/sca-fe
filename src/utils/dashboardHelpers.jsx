import { toDateString, toISO } from './dateHelpers'
import { getCaseStats, getCaseStatus } from './caseHelpers'

export const percent = (part, total) => (total ? Math.round((part / total) * 100) : 0)

// Most common values of a field, highest first: [{ label, count }]
export function countBy(cases, key, limit) {
  const counts = {}
  cases.forEach((item) => {
    if (item[key]) counts[item[key]] = (counts[item[key]] ?? 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

// Cases per month (by intake date) for the last `total` months
function casesPerMonth(cases, total = 6) {
  const now = new Date()
  return Array.from({ length: total }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (total - 1 - i), 1)
    const month = toISO(date).slice(0, 7)
    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      count: cases.filter((item) => item.intakeDate.startsWith(month)).length,
      color: 'bg-primary',
    }
  })
}

// Cases per day (by intake date) for the last `total` days
function casesPerDay(cases, total = 7) {
  return Array.from({ length: total }, (_, i) => {
    const day = toDateString(i - (total - 1))
    return {
      label: new Date(`${day}T00:00`).toLocaleString('en-US', { weekday: 'short' }),
      count: cases.filter((item) => item.intakeDate === day).length,
    }
  })
}

// Follow-ups from today onward that aren't accomplished, earliest first
function upcomingFollowUps(cases, limit = 5) {
  const today = toDateString()
  return cases
    .filter((item) => item.followUpDate >= today && getCaseStatus(item) !== 'accomplished')
    .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate))
    .slice(0, limit)
}

// Charts use one theme color (primary) so they follow Light, Dark and Custom
const RING_COLOR = ['stroke-primary']

// All dashboard chart data, built from the Cases list
export function getDashboardData(cases) {
  const total = cases.length
  const stats = getCaseStats(cases)
  const toRings = (items, colors) =>
    items.map((item, i) => ({ label: item.label, value: percent(item.count, total), color: colors[i % colors.length] }))

  return {
    progress: [
      { label: 'Resolved', note: 'Closed cases', value: percent(stats.closed, total), color: 'stroke-primary' },
      { label: 'Pending', note: 'For follow-up', value: percent(stats.forFollowUp, total), color: 'stroke-primary' },
      { label: 'Overdue', note: 'Past follow-up date', value: percent(stats.overdue, total), color: 'stroke-primary' },
    ],
    monthly: casesPerMonth(cases),
    weekly: {
      days: casesPerDay(cases),
      rings: toRings(countBy(cases, 'classification', 3), RING_COLOR),
    },
    concerns: {
      bars: countBy(cases, 'concern', 5).map((bar) => ({ ...bar, value: percent(bar.count, total) })),
      rings: toRings(countBy(cases, 'gradeSection', 3), RING_COLOR),
    },
    upcoming: upcomingFollowUps(cases),
  }
}
