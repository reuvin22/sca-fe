// Mock API with static data. Replace with real axios calls when the backend is ready.
import { generateRecordId } from '../utils/idHelpers'
import { toDateString } from '../utils/dateHelpers'
import { delay } from '../utils/mockApi'
import { emptyStudent } from '../utils/studentHelpers'

const students = [
  {
    dateEncoded: toDateString(-12),
    studentName: 'Princess Marian F. Dela Rosa',
    preferredName: 'Princess',
    age: '9',
    sex: 'Female',
    birthday: '2017-03-14',
    gradeSection: 'Grade 3 - Duhat',
    schoolYear: '2026-2027',
    address: 'Brgy. San Isidro, Quezon City',
    guardian1Name: 'Ana Dela Rosa',
    guardian1Relationship: 'Mother',
    guardian1Contact: '0917 123 4567',
    livesWith: 'Mother',
    emergencyPerson: 'Ana Dela Rosa',
    emergencyRelationship: 'Mother',
    emergencyNumber: '0917 123 4567',
    subjectsEnjoyed: 'English',
    subjectsDifficult: 'Math',
    feelingAboutSchool: 'Nervous',
    helpRequested: 'Emotional',
    prefersPrivate: 'Yes',
    reviewedBy: 'Guidance Counselor',
    dateReviewed: toDateString(-10),
    followUpNeeded: 'Yes',
    followUpDate: toDateString(3),
    recommendedActions: 'Individual Counseling',
  },
  {
    dateEncoded: toDateString(-5),
    studentName: 'Maria Santos',
    age: '11',
    sex: 'Female',
    birthday: '2015-08-02',
    gradeSection: 'Grade 5 - Narra',
    schoolYear: '2026-2027',
    guardian1Name: 'Jose Santos',
    guardian1Relationship: 'Father',
    livesWith: 'Both Parents',
    subjectsEnjoyed: 'Science',
    feelingAboutSchool: 'Happy',
    followUpNeeded: 'No',
  },
  {
    dateEncoded: toDateString(-1),
    studentName: 'John Reyes',
    age: '10',
    sex: 'Male',
    gradeSection: 'Grade 4 - Mangga',
    schoolYear: '2026-2027',
    livesWith: 'Guardian',
    followUpNeeded: 'Yes',
    followUpDate: toDateString(7),
  },
].map((item) => ({ ...emptyStudent, ...item, id: crypto.randomUUID(), recordId: generateRecordId() }))

export async function getStudents() {
  await delay()
  return students
}

export async function createStudent(data) {
  await delay()
  return { ...data, id: crypto.randomUUID(), recordId: generateRecordId() }
}

export async function updateStudent(data) {
  await delay()
  return data
}

export async function deleteStudent(id) {
  await delay()
  return id
}

// Used by useCrud
export const studentService = { getAll: getStudents, create: createStudent, update: updateStudent, remove: deleteStudent }
