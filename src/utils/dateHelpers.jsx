// Date object to "YYYY-MM-DD" in local time.
export const toISO = (date) => date.toLocaleDateString('en-CA')

// Today as "YYYY-MM-DD". `offset` is days from today.
export const toDateString = (offset = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return toISO(date)
}

// Adds days to a "YYYY-MM-DD" date
export const addDays = (iso, days) => {
  const date = new Date(`${iso}T00:00`)
  date.setDate(date.getDate() + days)
  return toISO(date)
}

// Monday of the week that contains `iso`
export const startOfWeek = (iso) => addDays(iso, -((new Date(`${iso}T00:00`).getDay() + 6) % 7))

// "14:30" to "2:30 PM"
export const formatTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':').map(Number)
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`
}

// "YYYY-MM-DD" to "Jun 03, 2026". Use this for every date shown to users.
export const formatDate = (iso) =>
  new Date(`${iso}T00:00`).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
