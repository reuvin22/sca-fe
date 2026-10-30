import { Paperclip, UserRound } from 'lucide-react'
import Badge from '../ui/Badge'
import { SEVERITY } from '../../utils/reportBoardHelpers'
import { formatDate } from '../../utils/dateHelpers'
import { getInitials } from '../../utils/stringHelpers'

// Kanban card for one report. Drag it to another column, or click to open it.
function ReportCard({ report, onOpen }) {
  const severity = SEVERITY[report.severity]

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', report.id)}
      onClick={() => onOpen(report)}
      className="w-full cursor-grab rounded-md bg-surface p-3 text-left shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 active:cursor-grabbing"
    >
      <p className="text-sm font-medium wrap-break-word text-gray-900">{report.subject}</p>
      <p className="mt-1 text-xs text-gray-500">
        {report.reporter.name} · {formatDate(report.createdAt.slice(0, 10))}
      </p>

      <div className="mt-3 flex items-center gap-2">
        {severity && <Badge label={severity.label} className={severity.className} />}
        {report.attachments.length > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-gray-500" title="Images or videos attached">
            <Paperclip size={12} />
            {report.attachments.length}
          </span>
        )}
        <span className="ml-auto" title={report.assignee ? `Assigned to ${report.assignee.name}` : 'Unassigned'}>
          {report.assignee ? (
            <span className="flex size-6 items-center justify-center rounded-full bg-brand-600 text-[10px] font-semibold text-white">
              {getInitials(report.assignee.name)}
            </span>
          ) : (
            <span className="flex size-6 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400">
              <UserRound size={12} />
            </span>
          )}
        </span>
      </div>
    </button>
  )
}

export default ReportCard
