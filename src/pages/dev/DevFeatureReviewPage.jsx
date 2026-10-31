import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CheckCheck, CircleCheck, CircleX, LoaderCircle, Megaphone, PenLine, Play, RotateCcw } from 'lucide-react'
import FeatureCard from '../../components/features/FeatureCard'
import Alert from '../../components/ui/Alert'
import Input from '../../components/ui/Input'
import Pagination from '../../components/ui/Pagination'
import Skeleton from '../../components/ui/Skeleton'
import usePaginatedList from '../../hooks/usePaginatedList'
import ReportModal from '../../components/dev/ReportModal'
import ApproveFeatureModal from '../../components/dev/ApproveFeatureModal'
import UpdateEditorModal from '../../components/dev/UpdateEditorModal'
import useFetch from '../../hooks/useFetch'
import useRequest from '../../hooks/useRequest'
import { featureListService } from '../../services/featureService'
import { getReport, updateReport } from '../../services/supportService'
import { getTeam } from '../../services/teamService'
import { PROGRESS_FILTERS, REVIEW, REVIEW_PAGE_FILTERS } from '../../utils/reportBoardHelpers'

const TEAM_TAGS = ['team'] // reload when the team changes (utils/dataSync)

// Card buttons. `changes` is what gets saved (review status, or the board status for Mark as Done).
const APPROVE = {
  key: 'approve',
  changes: { review: 'approved' },
  label: 'Approve',
  icon: CircleCheck,
  className: 'bg-green-600 text-white hover:bg-green-700',
}
const REJECT = {
  key: 'reject',
  changes: { review: 'rejected' },
  label: 'Reject',
  icon: CircleX,
  className: 'bg-red-600 text-white hover:bg-red-700',
}
const BACK_TO_REVIEW = {
  key: 'back',
  changes: { review: 'under-review' },
  label: 'Back to review',
  icon: RotateCcw,
  className: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
}
// Approved and in the queue: start working on it (In Progress on the board)
const START = {
  key: 'start',
  changes: { status: 'in-progress' },
  label: 'Start',
  icon: Play,
  className: 'bg-blue-600 text-white hover:bg-blue-700',
}
// Built: moves it to Done, then "Write update & notify users" appears
const MARK_DONE = {
  key: 'done',
  changes: { status: 'done' },
  label: 'Mark as Done',
  icon: CheckCheck,
  className: 'bg-indigo-600 text-white hover:bg-indigo-700',
}

// Buttons shown for each review status (approved ones depend on their progress)
const ACTIONS = {
  'under-review': [APPROVE, REJECT],
  rejected: [APPROVE, BACK_TO_REVIEW],
}
const APPROVED_ACTIONS = {
  todo: [START, MARK_DONE, REJECT, BACK_TO_REVIEW],
  'in-progress': [MARK_DONE, REJECT, BACK_TO_REVIEW],
}

const TOAST_FOR_STATUS = { 'in-progress': 'in progress', done: 'done. Write the update to notify users' }

const PILL = 'cursor-pointer rounded-md px-3 py-1 text-sm whitespace-nowrap'

// Developers: approve or reject feature requests. Only approved ones can be voted on by users.
// Approved has a second filter for progress (In Queue, In Progress, Done).
// Clicking a card opens its full details (requester, status, assignee, review, votes).
function DevFeatureReviewPage() {
  const [filters, setFilters] = useState({ status: 'under-review', progress: '', search: '' })
  const list = usePaginatedList(featureListService, null, filters)
  const [saving, setSaving] = useState(null) // "<id>-<review>" while saving
  const team = useFetch(getTeam, TEAM_TAGS)
  const [opened, setOpened] = useState(null)
  // The card only has public fields, so the full report is loaded before opening
  const open = useRequest(async (feature) => setOpened(await getReport(feature.id)))
  const currentUserId = useSelector((state) => state.auth.user?.id)
  // The feature being approved (the Approve & assign window), or null
  const [approving, setApproving] = useState(null)
  // The done feature whose update is being written (publishing notifies every user), or null
  const [writing, setWriting] = useState(null)

  const handlePublished = () => {
    toast.success('Update published. Everyone has been notified.')
    setWriting(null)
    list.reload()
    if (opened) open.run(opened) // the details window now shows "Released · View update"
  }

  // Saves a change made in the details window and refreshes the list behind it.
  // Approving an unassigned request assigns it to the developer viewing it.
  const handleChange = async (id, changes) => {
    const autoAssign = changes.review === 'approved' && !opened.assignee
    const updated = await updateReport(id, autoAssign ? { ...changes, assigneeId: currentUserId } : changes)
    setOpened(updated)
    list.reload()
    toast.success(changes.review ? `Now ${REVIEW[changes.review].label.toLowerCase()}` : 'Saved')
    return updated
  }

  // Approve & assign window: approves and sets the assignee in one save
  const handleApprove = async (assigneeId) => {
    await updateReport(approving.id, { review: 'approved', assigneeId })
    const assignee = team.data?.find((member) => member.id === assigneeId)
    toast.success(
      `"${approving.subject}" approved and assigned to ${assigneeId === currentUserId ? 'you' : assignee?.name}`,
    )
    list.reload()
    return true
  }

  const handleAction = async (feature, { key, changes }) => {
    if (changes.review === 'approved') return setApproving(feature) // pick the assignee first
    setSaving(`${feature.id}-${key}`)
    try {
      await updateReport(feature.id, changes)
      const status = changes.status ? TOAST_FOR_STATUS[changes.status] : REVIEW[changes.review].label.toLowerCase()
      toast.success(`"${feature.subject}" is now ${status}`)
      list.reload()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(null)
    }
  }

  // Done (built) requests: write the update that notifies everyone, or open it once published
  const doneActionsFor = (feature) =>
    feature.updateId ? (
      <Link
        to={`/updates/${feature.updateId}`}
        className="flex items-center gap-1.5 rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50"
      >
        <Megaphone size={16} />
        Released · View update
      </Link>
    ) : (
      <button
        type="button"
        onClick={() => setWriting(feature)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover"
      >
        <PenLine size={16} />
        Write update & notify users
      </button>
    )

  const actionsFor = (feature) => {
    if (feature.column === 'done') return doneActionsFor(feature)
    const actions = feature.review === 'approved' ? (APPROVED_ACTIONS[feature.column] ?? []) : ACTIONS[feature.review]
    return actions.map((action) => {
      const { key, label, icon: Icon, className } = action
      const busy = saving === `${feature.id}-${key}`
      return (
        <button
          key={key}
          type="button"
          disabled={Boolean(saving)}
          onClick={() => handleAction(feature, action)}
          className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
          {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Icon size={16} />}
          {label}
        </button>
      )
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Feature Review</h1>
        <p className="text-sm text-gray-500">Approve feature requests so users can vote on them, or reject them.</p>
      </div>

      <section className="space-y-4 rounded-xl bg-surface p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              id="search"
              type="search"
              placeholder="Search feature requests"
              aria-label="Search feature requests"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div
            className="flex flex-wrap gap-1 rounded-lg border border-gray-200 p-1"
            role="tablist"
            aria-label="Filter by status"
          >
            {REVIEW_PAGE_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={filters.status === option.value}
                // The progress filter only applies to Approved
                onClick={() => setFilters({ ...filters, status: option.value, progress: '' })}
                className={`flex-1 ${PILL} ${filters.status === option.value ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Second filter under Approved: where the work is (developer board column) */}
        {filters.status === 'approved' && (
          <div
            className="flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label="Filter approved requests by progress"
          >
            <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">Progress</span>
            {PROGRESS_FILTERS.map((option) => (
              <button
                key={option.value || 'all'}
                type="button"
                role="tab"
                aria-selected={filters.progress === option.value}
                onClick={() => setFilters({ ...filters, progress: option.value })}
                className={`${PILL} border ${filters.progress === option.value ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <Alert>{list.error || open.error}</Alert>
        <div className="space-y-3">
          {list.loading && Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
          {!list.loading && list.items.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-400">
              {filters.search ? 'No feature requests match your search.' : 'Nothing here.'}
            </p>
          )}
          {!list.loading &&
            list.items.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                actions={actionsFor(feature)}
                onOpen={open.loading ? undefined : open.run}
              />
            ))}
        </div>
        <div className="-mx-4 -mb-4 sm:-mx-5 sm:-mb-5">
          <Pagination pagination={list.pagination} onPageChange={list.setPage} />
        </div>
      </section>

      {opened && (
        <ReportModal
          report={opened}
          team={team.data ?? []}
          onChange={handleChange}
          onWriteUpdate={setWriting}
          onClose={() => setOpened(null)}
        />
      )}

      {writing && (
        <UpdateEditorModal
          task={{ id: writing.id, type: 'feature', subject: writing.subject }}
          onPublished={handlePublished}
          onClose={() => setWriting(null)}
        />
      )}

      {approving && (
        <ApproveFeatureModal
          feature={approving}
          team={team.data ?? []}
          currentUserId={currentUserId}
          onApprove={handleApprove}
          onClose={() => setApproving(null)}
        />
      )}
    </div>
  )
}

export default DevFeatureReviewPage
