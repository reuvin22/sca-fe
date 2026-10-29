import { Plus } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import DateRangePicker from '../ui/DateRangePicker'
import ExportMenu from '../common/ExportMenu'
import { STATUS_OPTIONS } from '../../utils/caseHelpers'

const statusOptions = [{ value: '', label: 'All' }, ...STATUS_OPTIONS]

function CaseFilters({ filters, onChange, onAdd, onExport }) {
  const handleChange = (e) => onChange({ ...filters, [e.target.name]: e.target.value })

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-full sm:w-64">
        <Input id="search" type="search" placeholder="Search name of learner" aria-label="Search name of learner" value={filters.search} onChange={handleChange} />
      </div>
      <DateRangePicker from={filters.from} to={filters.to} onChange={(range) => onChange({ ...filters, ...range })} />
      <div className="w-full sm:w-44">
        <Select id="status" aria-label="Filter by follow-up status" options={statusOptions} value={filters.status} onChange={handleChange} />
      </div>
      <div className="ml-auto flex gap-2">
        <ExportMenu onExport={onExport} />
        <Button fullWidth={false} onClick={onAdd}>
          <Plus size={16} />
          Add Case
        </Button>
      </div>
    </div>
  )
}

export default CaseFilters
