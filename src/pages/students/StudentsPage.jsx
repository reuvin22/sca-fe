import { useState } from 'react'
import StudentFilters from '../../components/students/StudentFilters'
import StudentsTable from '../../components/students/StudentsTable'
import StudentModal from '../../components/students/StudentModal'
import useCrud from '../../hooks/useCrud'
import { studentService } from '../../services/studentService'
import { STUDENT_COLUMNS, emptyStudentFilters, filterStudents } from '../../utils/studentHelpers'
import { exportTable } from '../../utils/export/exportTable'

function StudentsPage() {
  const { items: students, loading, saveItem, removeItem } = useCrud(studentService, 'Student record')
  const [filters, setFilters] = useState(emptyStudentFilters)
  // undefined = closed, null = add, object = edit
  const [selected, setSelected] = useState(undefined)
  const visibleStudents = filterStudents(students, filters)

  // Exports only the rows shown after filtering
  const handleExport = (format) =>
    exportTable(format, {
      sheetName: 'Students',
      columns: STUDENT_COLUMNS,
      rows: visibleStudents,
      fileName: 'students',
    })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <p className="text-sm text-gray-500">Student inventory records.</p>
      </div>

      <section className="rounded-xl bg-surface shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <StudentFilters filters={filters} onChange={setFilters} onAdd={() => setSelected(null)} onExport={handleExport} />
        </div>
        <StudentsTable students={visibleStudents} loading={loading} onRowClick={setSelected} />
      </section>

      {selected !== undefined && (
        <StudentModal
          key={selected?.id ?? 'new'}
          student={selected}
          onSave={saveItem}
          onDelete={removeItem}
          onClose={() => setSelected(undefined)}
        />
      )}
    </div>
  )
}

export default StudentsPage
