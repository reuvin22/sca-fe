import { formatDate, formatTime } from './dateHelpers'

// `tone` colors the status cell in exports (see utils/export/exportTheme)
// `accent` is the card border and title color
export const APPOINTMENT_STATUS = {
  scheduled: { label: 'Scheduled', className: 'bg-sky-100 text-sky-700', tone: 'sky', accent: 'border-l-sky-500 text-sky-600' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700', tone: 'green', accent: 'border-l-green-500 text-green-600' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-600', tone: 'gray', accent: 'border-l-gray-400 text-gray-500' },
  'no-show': { label: 'No-show', className: 'bg-red-100 text-red-700', tone: 'red', accent: 'border-l-red-500 text-red-600' },
}

export const APPOINTMENT_STATUS_OPTIONS = Object.entries(APPOINTMENT_STATUS).map(([value, { label }]) => ({ value, label }))

// 7:00 AM to 5:00 PM, every 30 minutes. Value is "HH:MM" so it sorts correctly.
export const TIME_OPTIONS = Array.from({ length: 21 }, (_, i) => {
  const value = `${String(7 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`
  return { value, label: formatTime(value) }
})

export const REMINDER_OPTIONS = ['None', '15 minutes before', '1 hour before', '1 day before'].map((value) => ({ value, label: value }))

// Dropdowns filled from Settings (labels must match category names)
export const APPOINTMENT_DROPDOWNS = [
  { id: 'staff', label: 'Assigned Staff' },
  { id: 'duration', label: 'Duration' },
  { id: 'type', label: 'Appointment Type' },
  { id: 'reason', label: 'Reason / Category' },
]

export const emptyAppointment = {
  studentName: '',
  staff: '',
  date: '',
  time: '',
  duration: '',
  type: '',
  reason: '',
  status: 'scheduled',
  reminder: 'None',
  rescheduledFrom: '',
  notes: '',
}

export const emptyAppointmentFilters = { search: '', from: '', to: '', status: '', staff: '' }

// Table and export columns (plain text)
export const APPOINTMENT_COLUMNS = [
  { id: 'appointmentId', label: 'Appointment ID', width: 16, value: (item) => item.appointmentId },
  { id: 'date', label: 'Date', width: 14, value: (item) => formatDate(item.date) },
  { id: 'time', label: 'Time', width: 10, value: (item) => formatTime(item.time) },
  { id: 'studentName', label: 'Student', width: 28, value: (item) => item.studentName },
  ...APPOINTMENT_DROPDOWNS.map(({ id, label }) => ({ id, label, width: 22, value: (item) => item[id] })),
  {
    id: 'status',
    label: 'Status',
    width: 13,
    value: (item) => APPOINTMENT_STATUS[item.status]?.label ?? '',
    color: (item) => APPOINTMENT_STATUS[item.status]?.tone,
  },
  { id: 'reminder', label: 'Reminder', width: 18, value: (item) => item.reminder },
  { id: 'rescheduledFrom', label: 'Rescheduled From', width: 22, value: (item) => item.rescheduledFrom },
  { id: 'notes', label: 'Notes', width: 40, value: (item) => item.notes },
]

// Saves the old date/time when an existing appointment is moved
export function applyReschedule(original, form) {
  if (!original || (original.date === form.date && original.time === form.time)) return form
  return { ...form, rescheduledFrom: `${formatDate(original.date)} ${formatTime(original.time)}` }
}

// Moved copy of an appointment, or null when the slot did not change
export function moveAppointment(item, date, time) {
  if (!item || (item.date === date && item.time === time)) return null
  return applyReschedule(item, { ...item, date, time })
}
