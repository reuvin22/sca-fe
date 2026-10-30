import { useState } from 'react'
import { CalendarDays, List } from 'lucide-react'
import AppointmentFilters from '../../components/appointments/AppointmentFilters'
import AppointmentsTable from '../../components/appointments/AppointmentsTable'
import AppointmentCalendar from '../../components/appointments/AppointmentCalendar'
import AppointmentModal from '../../components/appointments/AppointmentModal'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'
import usePaginatedList from '../../hooks/usePaginatedList'
import useRequest from '../../hooks/useRequest'
import { appointmentService } from '../../services/appointmentService'
import { APPOINTMENT_COLUMNS, emptyAppointmentFilters, moveAppointment } from '../../utils/appointmentHelpers'
import { exportAllRows } from '../../utils/export/exportAllRows'

const VIEWS = [
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'table', label: 'Table', icon: List },
]

function AppointmentsPage() {
  const [view, setView] = useState('calendar')
  const [filters, setFilters] = useState(emptyAppointmentFilters)
  // The calendar needs every matching appointment; the table loads one page at a time
  const list = usePaginatedList(appointmentService, 'Appointment', filters, { all: view === 'calendar' })
  const move = useRequest(list.saveItem)
  // undefined = closed, null = add, object = edit
  const [selected, setSelected] = useState(undefined)

  // Exports every appointment that matches the filters
  const handleExport = (format) =>
    exportAllRows(appointmentService, filters, format, {
      sheetName: 'Appointments',
      columns: APPOINTMENT_COLUMNS,
      fileName: 'appointments',
    })

  // Drag and drop on the calendar
  const handleMove = (id, date, time) => {
    const moved = moveAppointment(list.items.find((item) => item.id === id), date, time)
    if (moved) move.run(moved)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500">Schedule and manage counseling appointments.</p>
        </div>
        <div className="flex rounded-lg border border-gray-200 bg-surface p-1">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-sm ${view === id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <Alert>{move.error || list.error}</Alert>

      <section className="rounded-xl bg-surface shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <AppointmentFilters filters={filters} onChange={setFilters} onAdd={() => setSelected(null)} onExport={handleExport} />
        </div>
        {view === 'calendar' && (
          <AppointmentCalendar appointments={list.items} loading={list.loading} onSelect={setSelected} onMove={handleMove} />
        )}
        {view === 'table' && (
          <>
            <AppointmentsTable appointments={list.items} loading={list.loading} onRowClick={setSelected} />
            <Pagination pagination={list.pagination} onPageChange={list.setPage} />
          </>
        )}
      </section>

      {selected !== undefined && (
        <AppointmentModal
          key={selected?.id ?? 'new'}
          appointment={selected}
          onSave={list.saveItem}
          onDelete={list.removeItem}
          onClose={() => setSelected(undefined)}
        />
      )}
    </div>
  )
}

export default AppointmentsPage
