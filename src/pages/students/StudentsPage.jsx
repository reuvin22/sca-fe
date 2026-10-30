import { useState } from 'react'
import StudentFilters from '../../components/students/StudentFilters'
import StudentsTable from '../../components/students/StudentsTable'
import StudentModal from '../../components/students/StudentModal'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'
import usePaginatedList from '../../hooks/usePaginatedList'
import { studentService } from '../../services/studentService'
import { STUDENT_COLUMNS, emptyStudentFilters } from '../../utils/studentHelpers'
import { exportAllRows } from '../../utils/export/exportAllRows'

function StudentsPage() {
  const [filters, setFilters] = useState(emptyStudentFilters)
  // Filters and pages run on the backend
  const list = usePaginatedList(studentService, 'Student record', filters)
  // undefined = closed, null = add, object = edit
  const [selected, setSelected] = useState(undefined)

  // Exports every student that matches the filters
  const handleExport = (format) =>
    exportAllRows(studentService, filters, format, { sheetName: 'Students', columns: STUDENT_COLUMNS, fileName: 'students' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <p className="text-sm text-gray-500">Student inventory records.</p>
      </div>

      <Alert>{list.error}</Alert>

      <section className="rounded-xl bg-surface shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <StudentFilters filters={filters} onChange={setFilters} onAdd={() => setSelected(null)} onExport={handleExport} />
        </div>
        <StudentsTable students={list.items} loading={list.loading} onRowClick={setSelected} />
        <Pagination pagination={list.pagination} onPageChange={list.setPage} />
      </section>

      {selected !== undefined && (
        <StudentModal
          key={selected?.id ?? 'new'}
          student={selected}
          onSave={list.saveItem}
          onDelete={list.removeItem}
          onClose={() => setSelected(undefined)}
        />
      )}
    </div>
  )
}

export default StudentsPage
