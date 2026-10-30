import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Megaphone, PenLine } from 'lucide-react'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Select from '../ui/Select'
import Alert from '../ui/Alert'
import MediaGallery from '../common/MediaGallery'
import useRequest from '../../hooks/useRequest'
import { getReportAttachmentUrl } from '../../services/supportService'
import { REPORT_STATUS_OPTIONS, REPORT_TYPE, REVIEW_OPTIONS, SEVERITY } from '../../utils/reportBoardHelpers'
import { formatDate } from '../../utils/dateHelpers'

// Report details with its images/videos. Changing the status, assignee or review saves right away.
// `team`: developers that can be assigned. `onChange(id, changes)` saves and returns the updated report.
// `onWriteUpdate(report)`: when given, a Done report without a published update shows
// "Write update & notify users" (publishing the update sends everyone a notification).
function ReportModal({ report, team, onChange, onClose, onWriteUpdate }) {
  const save = useRequest(onChange)
  const loadUrl = useCallback((index) => getReportAttachmentUrl(report.id, index), [report.id])
  const severity = SEVERITY[report.severity]

  const assigneeOptions = [
    { value: '', label: 'Unassigned' },
    ...team.map((member) => ({ value: member.id, label: member.name })),
  ]

  return (
    <Modal title={report.subject} onClose={onClose} className="max-w-3xl">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Badge {...REPORT_TYPE[report.type]} />
          {severity && <Badge label={`${severity.label} severity`} className={severity.className} />}
          <span>
            From <span className="font-medium text-gray-900">{report.reporter.name}</span> ({report.reporter.email}) ·{' '}
            {formatDate(report.createdAt.slice(0, 10))}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Select
              label="Status"
              id="status"
              options={REPORT_STATUS_OPTIONS}
              value={report.status}
              disabled={save.loading}
              onChange={(e) => save.run(report.id, { status: e.target.value })}
            />
            <p className="mt-1 text-xs text-gray-500">Set to Done when it's built, then notify users below.</p>
          </div>
          <Select
            label="Assignee"
            id="assigneeId"
            options={assigneeOptions}
            value={report.assignee?.id ?? ''}
            disabled={save.loading}
            onChange={(e) => save.run(report.id, { assigneeId: e.target.value || null })}
          />
          {/* Feature requests: only approved ones appear for voting on the Feature Requests page */}
          {report.type === 'feature' && (
            <Select
              label={`Review · ${report.votes ?? 0} vote${report.votes === 1 ? '' : 's'}`}
              id="review"
              options={REVIEW_OPTIONS}
              value={report.review ?? 'under-review'}
              disabled={save.loading}
              onChange={(e) => save.run(report.id, { review: e.target.value })}
            />
          )}
        </div>
        <Alert>{save.error}</Alert>

        {/* Built: tell everyone with a system update (or open the one already published) */}
        {report.status === 'done' &&
          (report.updateId ? (
            <Link
              to={`/updates/${report.updateId}`}
              className="flex w-fit items-center gap-1.5 rounded-lg border border-sky-300 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50"
            >
              <Megaphone size={16} />
              Released · View update
            </Link>
          ) : (
            onWriteUpdate && (
              <div className="flex flex-col gap-3 rounded-lg border border-indigo-300 bg-indigo-500/10 p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-700">Done. Let everyone know what changed.</p>
                <button
                  type="button"
                  onClick={() => onWriteUpdate(report)}
                  className="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                >
                  <PenLine size={16} />
                  Write update & notify users
                </button>
              </div>
            )
          ))}

        <div>
          <h3 className="mb-1 text-sm font-semibold text-gray-900">Description</h3>
          <p className="text-sm whitespace-pre-wrap text-gray-700">{report.description}</p>
        </div>

        {report.attachments.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Images & videos</h3>
            <MediaGallery items={report.attachments} loadUrl={loadUrl} />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ReportModal
