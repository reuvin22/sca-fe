import DataTable from '../ui/DataTable'
import { STUDENT_COLUMNS } from '../../utils/studentHelpers'

// Screen-only styling: bold Record ID, long text cut to 2 lines
const columns = STUDENT_COLUMNS.map((column) => {
  if (column.id === 'recordId') {
    return { ...column, render: (item) => <span className="font-medium text-gray-900">{item.recordId}</span> }
  }
  if (column.type === 'textarea') {
    return { ...column, className: 'min-w-56 max-w-xs', render: (item) => <p className="line-clamp-2">{item[column.id]}</p> }
  }
  return column
})

function StudentsTable({ students, loading, onRowClick }) {
  return <DataTable columns={columns} rows={students} loading={loading} onRowClick={onRowClick} emptyText="No students found." />
}

export default StudentsTable
