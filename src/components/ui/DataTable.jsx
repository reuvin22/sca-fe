import { useState } from 'react'
import Skeleton from './Skeleton'
import Pagination from './Pagination'

const PAGE_SIZE = 15 // every table shows at most 15 rows per page

// `columns`: [{ label, value: (row) => text, render?: (row) => content, className? }]
// `render` is optional; plain `value` is shown when there is none. `onRowClick` is optional.
// Lists paged by the backend already send 15 rows; other lists (e.g. reports) are paged here.
function DataTable({ columns, rows, loading, onRowClick, emptyText = 'No records found.' }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages) // rows can shrink, e.g. after a delete
  const visibleRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

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
    <>
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
            {visibleRows.map((row) => (
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
      {rows.length > PAGE_SIZE && (
        <Pagination
          pagination={{ page: currentPage, limit: PAGE_SIZE, total: rows.length, totalPages }}
          onPageChange={setPage}
        />
      )}
    </>
  )
}

export default DataTable
