import SearchSelect from '../ui/SearchSelect'
import useFetch from '../../hooks/useFetch'
import { getStudentNames } from '../../services/studentService'

// Free-typing student name. Names from the Students records show as suggestions while typing.
function StudentSelect({ id, label = 'Student', value, onChange, error }) {
  const { data } = useFetch(getStudentNames)
  const names = [...new Set(data ?? [])]

  return (
    <SearchSelect
      label={label}
      id={id}
      value={value}
      options={names}
      onChange={onChange}
      error={error}
      placeholder="Type a student name"
      freeText
    />
  )
}

export default StudentSelect
