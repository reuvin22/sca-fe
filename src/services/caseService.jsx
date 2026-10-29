// Mock API with static data. Replace with real axios calls when the backend is ready.
import { generateCaseNumber, toDateString } from '../utils/caseHelpers'

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

const cases = [
  { studentName: 'Maria Santos', gradeSection: '10 - Rizal', concern: 'Academic', date: toDateString(-14), followUpDate: toDateString(-2) },
  { studentName: 'John Reyes', gradeSection: '11 - Mabini', concern: 'Behavior', date: toDateString(-10), followUpDate: toDateString(0) },
  { studentName: 'Angela Cruz', gradeSection: '9 - Bonifacio', concern: 'Family', date: toDateString(-7), followUpDate: toDateString(3) },
  { studentName: 'Mark Dela Rosa', gradeSection: '12 - Luna', concern: 'Career', date: toDateString(-5), followUpDate: toDateString(-1) },
  { studentName: 'Sofia Garcia', gradeSection: '8 - Aguinaldo', concern: 'Wellness', date: toDateString(-3), followUpDate: toDateString(7) },
  { studentName: 'Daniel Lim', gradeSection: '10 - Rizal', concern: 'Academic', date: toDateString(-1), followUpDate: toDateString(0) },
].map((item) => ({ ...item, id: crypto.randomUUID(), caseNumber: generateCaseNumber() }))

export async function getCases() {
  await delay()
  return cases
}

export async function createCase(data) {
  await delay()
  return { ...data, id: crypto.randomUUID(), caseNumber: generateCaseNumber() }
}

export async function updateCase(data) {
  await delay()
  return data
}

export async function deleteCase(id) {
  await delay()
  return id
}
