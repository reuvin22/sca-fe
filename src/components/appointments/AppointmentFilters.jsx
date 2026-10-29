import { Plus } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import DateRangePicker from '../ui/DateRangePicker'
import ExportMenu from '../common/ExportMenu'
import CategoryFilter from '../common/CategoryFilter'
import { APPOINTMENT_DROPDOWNS, APPOINTMENT_STATUS_OPTIONS } from '../../utils/appointmentHelpers'

const statusOptions = [{ value: '', label: 'All statuses' }, ...APPOINTMENT_STATUS_OPTIONS]
const staffField = APPOINTMENT_DROPDOWNS.find((field) => field.id === 'staff')

function AppointmentFilters({ filters, onChange, onAdd, onExport }) {
  const handleChange = (e) => onChange({ ...filters, [e.target.name]: e.target.value })

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-full sm:w-56">
        <Input id="search" type="search" placeholder="Search student" aria-label="Search student" value={filters.search} onChange={handleChange} />
      </div>
      <DateRangePicker from={filters.from} to={filters.to} onChange={(range) => onChange({ ...filters, ...range })} />
      <Select id="status" aria-label="Filter by status" options={statusOptions} value={filters.status} onChange={handleChange} />
      <CategoryFilter field={staffField} value={filters.staff} onChange={handleChange} />
      <div className="ml-auto flex gap-2">
        <ExportMenu onExport={onExport} />
        <Button fullWidth={false} onClick={onAdd}>
          <Plus size={16} />
          Add Appointment
        </Button>
      </div>
    </div>
  )
}

export default AppointmentFilters
