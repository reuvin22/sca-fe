// Mock API with static data. Replace with real axios calls when the backend is ready.
import { generateCaseNumber } from '../utils/idHelpers'
import { toDateString } from '../utils/dateHelpers'
import { delay } from '../utils/mockApi'

// Kept in memory so changes show on every page until refresh
let cases = [
  {
    intakeDate: toDateString(-6),
    learnerName: 'Princess Marian F. Dela Rosa',
    gradeSection: 'Grade 3 - Duhat',
    concern: 'Emotional / Mental Health',
    action: 'Psychological First Aid',
    referredTo: 'Referred to External Agency',
    classification: 'Parent Request',
    followUpDate: toDateString(-3),
    remarks: 'Guardian reported the concern. Coordinated with external agency.',
  },
  {
    intakeDate: toDateString(-10),
    learnerName: 'Maria Santos',
    gradeSection: 'Grade 5 - Narra',
    concern: 'Academic',
    action: 'Individual Counseling',
    referredTo: 'Referred to Class Adviser',
    classification: 'Teacher Referral',
    followUpDate: toDateString(0),
    remarks: 'Missing assignments for two weeks.',
  },
  {
    intakeDate: toDateString(-4),
    learnerName: 'John Reyes',
    gradeSection: 'Grade 4 - Mangga',
    concern: 'Behavioral',
    action: 'Parent Conference',
    referredTo: 'Referred to Principal',
    classification: 'Walk-in',
    followUpDate: toDateString(5),
    remarks: '',
  },
  {
    intakeDate: toDateString(-2),
    learnerName: 'Angela Cruz',
    gradeSection: 'Grade 6 - Molave',
    concern: 'Family',
    action: 'Home Visitation',
    referredTo: 'Not Referred',
    classification: 'Follow-up',
    followUpDate: toDateString(-1),
    remarks: 'Schedule another home visit.',
  },
].map((item) => ({ ...item, id: crypto.randomUUID(), caseNumber: generateCaseNumber() }))

export async function getCases() {
  await delay()
  return [...cases]
}

export async function createCase(data) {
  await delay()
  const created = { ...data, id: crypto.randomUUID(), caseNumber: generateCaseNumber() }
  cases = [created, ...cases]
  return created
}

export async function updateCase(data) {
  await delay()
  cases = cases.map((item) => (item.id === data.id ? data : item))
  return data
}

export async function deleteCase(id) {
  await delay()
  cases = cases.filter((item) => item.id !== id)
  return id
}

// Used by useCrud
export const caseService = { getAll: getCases, create: createCase, update: updateCase, remove: deleteCase }
