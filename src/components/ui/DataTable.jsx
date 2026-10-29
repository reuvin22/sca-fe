import Skeleton from './Skeleton'

// `columns`: [{ label, value: (row) => text, render?: (row) => content, className? }]
// `render` is optional; plain `value` is shown when there is none. `onRowClick` is optional.
function DataTable({ columns, rows, loading, onRowClick, emptyText = 'No records found.' }) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    )
  }

  if (rows.length === 0) {
    return <p className="p-8 text-center text-sm text-gray-400">{emptyText}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-100 text-xs text-gray-500 uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column.label} className="px-4 py-3 font-medium whitespace-nowrap">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={onRowClick && (() => onRowClick(row))}
              className={`text-gray-700 ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            >
              {columns.map((column) => (
                <td key={column.label} className={`px-4 py-3 ${column.className ?? 'whitespace-nowrap'}`}>
                  {column.render ? column.render(row) : column.value(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
