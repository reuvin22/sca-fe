import SearchSelect from '../ui/SearchSelect'
import useFetch from '../../hooks/useFetch'
import useCategoryOptions from '../../hooks/useCategoryOptions'
import useAddSettingsOption from '../../hooks/useAddSettingsOption'
import { getStudentNames } from '../../services/studentService'

const DATA_TAGS = ['students']

export const STUDENT_NAME_CATEGORY = 'Student Name'

// Student dropdown: names from Settings → Student Name (kept for repeat cases and records) and from the
// Students records. A new name is added to Settings with "Add", like every other dropdown.
function StudentSelect({ id, label = 'Student', value, onChange, error }) {
  const { data } = useFetch(getStudentNames, DATA_TAGS)
  const saved = useCategoryOptions(STUDENT_NAME_CATEGORY)
  const addOption = useAddSettingsOption()
  const names = [...new Set([...(saved ?? []), ...(data ?? [])])].sort((a, b) => a.localeCompare(b))

  return (
    <SearchSelect
      label={label}
      id={id}
      value={value}
      options={names}
      onChange={onChange}
      onCreate={(text) => addOption(STUDENT_NAME_CATEGORY, text)}
      error={error}
      placeholder="Search or add a student"
    />
  )
}

export default StudentSelect
