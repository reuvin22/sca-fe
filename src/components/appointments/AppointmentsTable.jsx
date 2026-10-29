import DataTable from '../ui/DataTable'
import Badge from '../ui/Badge'
import { APPOINTMENT_COLUMNS, APPOINTMENT_STATUS } from '../../utils/appointmentHelpers'

// Screen-only styling for some columns
const renders = {
  appointmentId: { render: (item) => <span className="font-medium text-gray-900">{item.appointmentId}</span> },
  status: { render: (item) => <Badge {...APPOINTMENT_STATUS[item.status]} /> },
  notes: { className: 'min-w-56 max-w-xs', render: (item) => <p className="line-clamp-2">{item.notes}</p> },
}

const columns = APPOINTMENT_COLUMNS.map((column) => ({ ...column, ...renders[column.id] }))

function AppointmentsTable({ appointments, loading, onRowClick }) {
  return (
    <DataTable columns={columns} rows={appointments} loading={loading} onRowClick={onRowClick} emptyText="No appointments found." />
  )
}

export default AppointmentsTable
