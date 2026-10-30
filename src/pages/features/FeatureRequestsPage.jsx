import { useState } from 'react'
import { toast } from 'react-toastify'
import { Lightbulb, Plus } from 'lucide-react'
import FeatureCard from '../../components/features/FeatureCard'
import SupportModal from '../../components/common/SupportModal'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Pagination from '../../components/ui/Pagination'
import Skeleton from '../../components/ui/Skeleton'
import usePaginatedList from '../../hooks/usePaginatedList'
import { featureListService, myFeatureService, toggleFeatureVote } from '../../services/featureService'
import { FEATURE_FILTERS, PROGRESS_FILTERS } from '../../utils/reportBoardHelpers'

const NO_FILTERS = {}

function ListSkeleton() {
  return Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
}

// Every feature request (left, most votes first, with search and a status filter; "All" leaves out rejected;
// Approved has a second filter for progress: All, In Queue, In Progress, Done)
// and the user's own requests (right, 30%). Users vote on approved requests to set priorities.
function FeatureRequestsPage() {
  // Opens on Approved: the requests users can vote on
  const [filters, setFilters] = useState({ status: 'approved', progress: '', search: '' })
  const all = usePaginatedList(featureListService, null, filters)
  const mine = usePaginatedList(myFeatureService, null, NO_FILTERS)
  const [votingId, setVotingId] = useState(null)
  const [requesting, setRequesting] = useState(false)

  // Votes change the order and ranks, so both lists reload
  const handleVote = async (feature) => {
    setVotingId(feature.id)
    try {
      const result = await toggleFeatureVote(feature.id)
      toast.success(result.voted ? 'Vote added' : 'Vote removed')
      all.reload()
      mine.reload()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setVotingId(null)
    }
  }

  const handleSent = () => {
    mine.reload()
    all.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Feature Requests</h1>
          <p className="text-sm text-gray-500">Vote on approved ideas to decide what gets built first.</p>
        </div>
        <Button fullWidth={false} onClick={() => setRequesting(true)}>
          <Plus size={16} />
          Request a feature
        </Button>
      </div>

      {/* Left: all requests (70%). Right: your requests (30%), split by a border. Stacked on small screens. */}
      <div className="flex flex-col overflow-hidden rounded-xl bg-surface shadow-sm lg:flex-row">
        <section className="min-w-0 space-y-4 p-4 sm:p-5 lg:w-[70%]">
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
            {/* Wraps onto two rows on narrow phones so no filter is pushed off screen */}
            <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 p-1" role="tablist" aria-label="Filter by status">
              {FEATURE_FILTERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={filters.status === option.value}
                  // The progress filter only applies to Approved
                  onClick={() => setFilters({ ...filters, status: option.value, progress: '' })}
                  className={`flex-1 cursor-pointer rounded-md px-3 py-1 text-sm whitespace-nowrap ${filters.status === option.value ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Second filter under Approved: how far the work is */}
          {filters.status === 'approved' && (
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter approved requests by progress">
              <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">Progress</span>
              {PROGRESS_FILTERS.map((option) => (
                <button
                  key={option.value || 'all'}
                  type="button"
                  role="tab"
                  aria-selected={filters.progress === option.value}
                  onClick={() => setFilters({ ...filters, progress: option.value })}
                  className={`cursor-pointer rounded-md border px-3 py-1 text-sm whitespace-nowrap ${filters.progress === option.value ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <Alert>{all.error}</Alert>
          <div className="space-y-3">
            {all.loading && <ListSkeleton />}
            {!all.loading && all.items.length === 0 && (
              <p className="py-10 text-center text-sm text-gray-400">
                {filters.search || filters.progress ? 'No feature requests match these filters.' : 'No feature requests here yet.'}
              </p>
            )}
            {!all.loading &&
              all.items.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} onVote={handleVote} voting={votingId === feature.id} />
              ))}
          </div>
          <div className="-mx-4 -mb-4 sm:-mx-5 sm:-mb-5">
            <Pagination pagination={all.pagination} onPageChange={all.setPage} />
          </div>
        </section>

        <aside className="min-w-0 space-y-4 border-t border-gray-200 p-4 sm:p-5 lg:w-[30%] lg:border-t-0 lg:border-l">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-brand-600" />
            <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Your requests</h2>
          </div>

          <Alert>{mine.error}</Alert>
          <div className="space-y-2">
            {mine.loading && <ListSkeleton />}
            {!mine.loading && mine.items.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">You haven't requested a feature yet.</p>
            )}
            {!mine.loading &&
              mine.items.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} onVote={handleVote} voting={votingId === feature.id} compact />
              ))}
          </div>
          <div className="-mx-4 -mb-4 sm:-mx-5 sm:-mb-5">
            <Pagination pagination={mine.pagination} onPageChange={mine.setPage} />
          </div>
        </aside>
      </div>

      {requesting && <SupportModal initialType="feature" onSent={handleSent} onClose={() => setRequesting(false)} />}
    </div>
  )
}

export default FeatureRequestsPage
