// Date object to "YYYY-MM-DD" in local time.
export const toISO = (date) => date.toLocaleDateString('en-CA')

// "YYYY-MM-DD" to "Oct 29, 2026"
export const formatDate = (iso) =>
  new Date(`${iso}T00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
