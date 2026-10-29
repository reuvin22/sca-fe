import { Plus } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import DateRangePicker from '../ui/DateRangePicker'
import CategoryFilter from '../common/CategoryFilter'
import ExportMenu from '../common/ExportMenu'
import { STUDENT_FILTERS, emptyStudentFilters } from '../../utils/studentHelpers'

function StudentFilters({ filters, onChange, onAdd, onExport }) {
  const handleChange = (e) => onChange({ ...filters, [e.target.name]: e.target.value })
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-full sm:w-56">
        <Input id="search" type="search" placeholder="Search student name" aria-label="Search student name" value={filters.search} onChange={handleChange} />
      </div>
      <DateRangePicker from={filters.from} to={filters.to} onChange={(range) => onChange({ ...filters, ...range })} />
      {STUDENT_FILTERS.map((field) => (
        <CategoryFilter key={field.id} field={field} value={filters[field.id]} onChange={handleChange} />
      ))}
      {hasFilters && (
        <button onClick={() => onChange(emptyStudentFilters)} className="cursor-pointer px-2 text-sm text-gray-500 hover:text-gray-900">
          Clear
        </button>
      )}
      <div className="ml-auto flex gap-2">
        <ExportMenu onExport={onExport} />
        <Button fullWidth={false} onClick={onAdd}>
          <Plus size={16} />
          Add Student
        </Button>
      </div>
    </div>
  )
}

export default StudentFilters
