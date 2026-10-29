import { Plus } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import DateRangePicker from '../ui/DateRangePicker'
import { FOLLOW_UP } from '../../utils/caseHelpers'

const statusOptions = [
  { value: '', label: 'All' },
  ...Object.entries(FOLLOW_UP).map(([value, { label }]) => ({ value, label })),
]

function CaseFilters({ filters, onChange, onAdd }) {
  const handleChange = (e) => onChange({ ...filters, [e.target.name]: e.target.value })

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-full sm:w-64">
        <Input id="search" type="search" placeholder="Search student name" aria-label="Search student name" value={filters.search} onChange={handleChange} />
      </div>
      <DateRangePicker from={filters.from} to={filters.to} onChange={(range) => onChange({ ...filters, ...range })} />
      <div className="w-full sm:w-44">
        <Select id="status" aria-label="Filter by follow-up" options={statusOptions} value={filters.status} onChange={handleChange} />
      </div>
      <Button fullWidth={false} onClick={onAdd} className="ml-auto">
        <Plus size={16} />
        Add Case
      </Button>
    </div>
  )
}

export default CaseFilters
