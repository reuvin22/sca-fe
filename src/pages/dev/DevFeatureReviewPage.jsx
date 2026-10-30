import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { CircleCheck, CircleX, LoaderCircle, RotateCcw } from 'lucide-react'
import FeatureCard from '../../components/features/FeatureCard'
import Alert from '../../components/ui/Alert'
import Input from '../../components/ui/Input'
import Pagination from '../../components/ui/Pagination'
import Skeleton from '../../components/ui/Skeleton'
import usePaginatedList from '../../hooks/usePaginatedList'
import ReportModal from '../../components/dev/ReportModal'
import ApproveFeatureModal from '../../components/dev/ApproveFeatureModal'
import useFetch from '../../hooks/useFetch'
import useRequest from '../../hooks/useRequest'
import { featureListService } from '../../services/featureService'
import { getReport, updateReport } from '../../services/supportService'
import { getTeam } from '../../services/teamService'
import { REVIEW, REVIEW_PAGE_FILTERS } from '../../utils/reportBoardHelpers'

// Buttons shown for each status: approve / reject, or send a decided request back to review
const ACTIONS = {
  'under-review': [
    { review: 'approved', label: 'Approve', icon: CircleCheck, className: 'bg-green-600 text-white hover:bg-green-700' },
    { review: 'rejected', label: 'Reject', icon: CircleX, className: 'bg-red-600 text-white hover:bg-red-700' },
  ],
  approved: [
    { review: 'rejected', label: 'Reject', icon: CircleX, className: 'bg-red-600 text-white hover:bg-red-700' },
    { review: 'under-review', label: 'Back to review', icon: RotateCcw, className: 'border border-gray-300 text-gray-700 hover:bg-gray-50' },
  ],
  rejected: [
    { review: 'approved', label: 'Approve', icon: CircleCheck, className: 'bg-green-600 text-white hover:bg-green-700' },
    { review: 'under-review', label: 'Back to review', icon: RotateCcw, className: 'border border-gray-300 text-gray-700 hover:bg-gray-50' },
  ],
}

// Developers: approve or reject feature requests. Only approved ones can be voted on by users.
// Clicking a card opens its full details (requester, column, assignee, review, votes).
function DevFeatureReviewPage() {
  const [filters, setFilters] = useState({ status: 'under-review', search: '' })
  const list = usePaginatedList(featureListService, null, filters)
  const [saving, setSaving] = useState(null) // "<id>-<review>" while saving
  const team = useFetch(getTeam)
  const [opened, setOpened] = useState(null)
  // The card only has public fields, so the full report is loaded before opening
  const open = useRequest(async (feature) => setOpened(await getReport(feature.id)))
  const currentUserId = useSelector((state) => state.auth.user?.id)
  // The feature being approved (the Approve & assign window), or null
  const [approving, setApproving] = useState(null)

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
    toast.success(`"${approving.subject}" approved and assigned to ${assigneeId === currentUserId ? 'you' : assignee?.name}`)
    list.reload()
    return true
  }

  const handleReview = async (feature, review) => {
    if (review === 'approved') return setApproving(feature) // pick the assignee first
    setSaving(`${feature.id}-${review}`)
    try {
      await updateReport(feature.id, { review })
      toast.success(`"${feature.subject}" is now ${REVIEW[review].label.toLowerCase()}`)
      list.reload()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(null)
    }
  }

  const actionsFor = (feature) =>
    ACTIONS[feature.review].map(({ review, label, icon: Icon, className }) => {
      const busy = saving === `${feature.id}-${review}`
      return (
        <button
          key={review}
          type="button"
          disabled={Boolean(saving)}
          onClick={() => handleReview(feature, review)}
          className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
          {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Icon size={16} />}
          {label}
        </button>
      )
    })

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
          <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 p-1" role="tablist" aria-label="Filter by status">
            {REVIEW_PAGE_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={filters.status === option.value}
                onClick={() => setFilters({ ...filters, status: option.value })}
                className={`flex-1 cursor-pointer rounded-md px-3 py-1 text-sm whitespace-nowrap ${filters.status === option.value ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

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
              <FeatureCard key={feature.id} feature={feature} actions={actionsFor(feature)} onOpen={open.loading ? undefined : open.run} />
            ))}
        </div>
        <div className="-mx-4 -mb-4 sm:-mx-5 sm:-mb-5">
          <Pagination pagination={list.pagination} onPageChange={list.setPage} />
        </div>
      </section>

      {opened && <ReportModal report={opened} team={team.data ?? []} onChange={handleChange} onClose={() => setOpened(null)} />}

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
