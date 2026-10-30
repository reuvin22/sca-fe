import { useCallback } from 'react'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Select from '../ui/Select'
import Alert from '../ui/Alert'
import MediaGallery from '../common/MediaGallery'
import useRequest from '../../hooks/useRequest'
import { getReportAttachmentUrl } from '../../services/supportService'
import { REPORT_STATUS_OPTIONS, REPORT_TYPE, REVIEW_OPTIONS, SEVERITY } from '../../utils/reportBoardHelpers'
import { formatDate } from '../../utils/dateHelpers'

// Report details with its images/videos. Changing the column or assignee saves right away.
// `team`: developers that can be assigned. `onChange(id, changes)` saves and returns the updated report.
function ReportModal({ report, team, onChange, onClose }) {
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
          <Select
            label="Column"
            id="status"
            options={REPORT_STATUS_OPTIONS}
            value={report.status}
            disabled={save.loading}
            onChange={(e) => save.run(report.id, { status: e.target.value })}
          />
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
