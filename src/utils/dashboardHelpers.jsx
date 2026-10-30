import { toDateString, toISO } from './dateHelpers'

export const percent = (part, total) => (total ? Math.round((part / total) * 100) : 0)

// Charts use one theme color (primary) so they follow Light, Dark and Custom
const RING_COLOR = ['stroke-primary']

// Count for `key` in a backend list like [{ month: '2026-10', count }], or 0
const countFor = (list, field, key) => list.find((item) => item[field] === key)?.count ?? 0

// Cases per month (by intake date) for the last 6 months, including empty months
function casesPerMonth(counts, total = 6) {
  const now = new Date()
  return Array.from({ length: total }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (total - 1 - i), 1)
    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      count: countFor(counts, 'month', toISO(date).slice(0, 7)),
      color: 'bg-primary',
    }
  })
}

// Cases per day (by intake date) for the last 7 days, including empty days
function casesPerDay(counts, total = 7) {
  return Array.from({ length: total }, (_, i) => {
    const day = toDateString(i - (total - 1))
    return {
      label: new Date(`${day}T00:00`).toLocaleString('en-US', { weekday: 'short' }),
      count: countFor(counts, 'date', day),
    }
  })
}

// All dashboard chart data, built from GET /reports/dashboard
export function getDashboardData(data) {
  const { caseStats: stats } = data
  const toRings = (items) =>
    items.map((item, i) => ({ label: item.label, value: percent(item.count, stats.total), color: RING_COLOR[i % RING_COLOR.length] }))

  return {
    stats,
    progress: [
      { label: 'Resolved', note: 'Closed cases', value: percent(stats.closed, stats.total), color: 'stroke-primary' },
      { label: 'Pending', note: 'For follow-up', value: percent(stats.forFollowUp, stats.total), color: 'stroke-primary' },
      { label: 'Overdue', note: 'Past follow-up date', value: percent(stats.overdue, stats.total), color: 'stroke-primary' },
    ],
    monthly: casesPerMonth(data.casesPerMonth),
    weekly: { days: casesPerDay(data.casesPerDay), rings: toRings(data.classifications) },
    concerns: {
      bars: data.concerns.map((bar) => ({ ...bar, value: percent(bar.count, stats.total) })),
      rings: toRings(data.gradeSections),
    },
    upcoming: data.upcomingFollowUps,
  }
}
