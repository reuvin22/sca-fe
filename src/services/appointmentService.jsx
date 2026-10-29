// Mock API with static data. Replace with real axios calls when the backend is ready.
import { generateAppointmentId } from '../utils/idHelpers'
import { toDateString } from '../utils/dateHelpers'
import { delay } from '../utils/mockApi'
import { emptyAppointment } from '../utils/appointmentHelpers'

// Kept in memory so changes show on every page until refresh
let appointments = [
  {
    studentName: 'Princess Marian F. Dela Rosa',
    staff: 'Ms. Reyes',
    date: toDateString(0),
    time: '09:00',
    duration: '60 minutes',
    type: 'Individual Counseling',
    reason: 'Emotional / Mental Health',
    reminder: '1 day before',
    notes: 'Follow-up on PFA session.',
  },
  {
    studentName: 'Maria Santos',
    staff: 'Mr. Cruz',
    date: toDateString(1),
    time: '13:30',
    duration: '30 minutes',
    type: 'Consultation',
    reason: 'Academic',
    reminder: '1 hour before',
  },
  {
    studentName: 'John Reyes',
    staff: 'Ms. Reyes',
    date: toDateString(-2),
    time: '10:00',
    duration: '45 minutes',
    type: 'Parent Conference',
    reason: 'Behavioral',
    status: 'completed',
  },
  {
    studentName: 'Maria Santos',
    staff: 'Mr. Cruz',
    date: toDateString(-1),
    time: '15:00',
    duration: '30 minutes',
    type: 'Follow-up Session',
    reason: 'Academic',
    status: 'no-show',
  },
].map((item) => ({ ...emptyAppointment, ...item, id: crypto.randomUUID(), appointmentId: generateAppointmentId() }))

export async function getAppointments() {
  await delay()
  return [...appointments]
}

export async function createAppointment(data) {
  await delay()
  const created = { ...data, id: crypto.randomUUID(), appointmentId: generateAppointmentId() }
  appointments = [created, ...appointments]
  return created
}

export async function updateAppointment(data) {
  await delay()
  appointments = appointments.map((item) => (item.id === data.id ? data : item))
  return data
}

export async function deleteAppointment(id) {
  await delay()
  appointments = appointments.filter((item) => item.id !== id)
  return id
}

// Used by useCrud
export const appointmentService = {
  getAll: getAppointments,
  create: createAppointment,
  update: updateAppointment,
  remove: deleteAppointment,
}
