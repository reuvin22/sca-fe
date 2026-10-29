import Select from '../ui/Select'
import useFetch from '../../hooks/useFetch'
import { getStudents } from '../../services/studentService'

// Dropdown of student names from the Students records
function StudentSelect({ id, label = 'Student', value, onChange, error }) {
  const { data: students, loading } = useFetch(getStudents)
  const names = (students ?? []).map((student) => student.studentName)

  // Keep a saved name even if the student no longer exists
  if (value && !names.includes(value)) names.unshift(value)

  return (
    <Select
      label={label}
      id={id}
      value={value}
      onChange={onChange}
      error={error}
      disabled={loading}
      options={[
        { value: '', label: loading ? 'Loading students...' : 'Select student' },
        ...names.map((name) => ({ value: name, label: name })),
      ]}
    />
  )
}

export default StudentSelect
