import { STUDENTS_ROUTE } from '../api/routes'
import { createListService, fetchAllPages } from '../utils/apiHelpers'

// { list, listAll, get, create, update, remove }
export const studentService = createListService(STUDENTS_ROUTE)

// All student names, for the student dropdown
export async function getStudentNames() {
  const students = await fetchAllPages(STUDENTS_ROUTE)
  return students.map((student) => student.studentName)
}
