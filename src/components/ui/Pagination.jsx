import { ChevronLeft, ChevronRight } from 'lucide-react'

const BUTTON =
  'flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'

// "Showing 1–15 of 40" with Previous / Next (15 per page). `pagination`: { page, limit, total, totalPages }
function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.total === 0) return null
  const { page, limit, total, totalPages } = pagination
  const first = (page - 1) * limit + 1
  const last = Math.min(page * limit, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
      <p className="text-sm text-gray-500">
        Showing {first}–{last} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className={BUTTON} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <span className="text-sm text-gray-500">
          {page} / {totalPages}
        </span>
        <button type="button" className={BUTTON} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
