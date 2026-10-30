import { LoaderCircle, ThumbsUp } from 'lucide-react'
import Badge from '../ui/Badge'
import { PROGRESS, REVIEW } from '../../utils/reportBoardHelpers'
import { formatDate } from '../../utils/dateHelpers'

// One feature request: rank (#1 has the most votes among approved), status, votes.
// `compact` is the smaller card used in "Your requests". `onVote` is only used for approved requests.
// `actions` (developers' review buttons) also shows the full description.
// `onOpen(feature)` makes the whole card clickable (mouse or Enter/Space), e.g. to open details.
function FeatureCard({ feature, onVote, voting, compact = false, actions, onOpen }) {
  const approved = feature.review === 'approved'
  const progress =
    feature.column === 'done' ? PROGRESS[feature.updateId ? 'released' : 'done'] : approved ? PROGRESS[feature.column] : null
  const clickable = onOpen
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-label': `Open ${feature.subject}`,
        onClick: () => onOpen(feature),
        onKeyDown: (e) => {
          if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return
          e.preventDefault()
          onOpen(feature)
        },
      }
    : {}

  return (
    // Card color follows the status: green approved, orange under review, red rejected
    <article
      {...clickable}
      className={`flex gap-3 rounded-lg border border-l-4 ${REVIEW[feature.review].card} ${compact ? 'p-3' : 'p-4'} ${onOpen ? 'cursor-pointer transition hover:shadow-md' : ''}`}
    >
      {/* Rank (approved) or a dash (not ranked yet) */}
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg font-bold ${compact ? 'size-9 text-sm' : 'size-11 text-base'} ${approved ? 'bg-brand-50 text-brand-700' : 'bg-gray-100 text-gray-400'}`}
        title={approved ? `Rank ${feature.rank} by votes` : 'Not ranked until approved'}
      >
        {approved ? `#${feature.rank}` : '—'}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`font-semibold wrap-break-word text-gray-900 ${compact ? 'text-sm' : ''}`}>{feature.subject}</h3>
          <Badge {...REVIEW[feature.review]} />
          {/* Progress of approved requests (developer board column); "Released" once the update was published */}
          {progress && <Badge {...progress} />}
          {feature.mine && !compact && <Badge label="Yours" className="bg-brand-50 text-brand-700" />}
        </div>
        {!compact && (
          <p className={`mt-1 text-sm whitespace-pre-wrap text-gray-600 ${actions ? '' : 'line-clamp-3'}`}>{feature.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">{formatDate(feature.createdAt.slice(0, 10))}</p>
        {/* Buttons work on their own without also opening the card */}
        {actions && (
          <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>

      {/* Vote button (approved) or just the count */}
      {approved && onVote ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation() // voting doesn't open the card
            onVote(feature)
          }}
          disabled={voting}
          aria-pressed={feature.voted}
          aria-label={feature.voted ? `Remove your vote (${feature.votes} votes)` : `Vote (${feature.votes} votes)`}
          className={`flex h-fit shrink-0 cursor-pointer flex-col items-center rounded-lg border px-3 py-1.5 text-sm font-semibold transition disabled:cursor-wait ${feature.voted ? 'border-primary bg-primary text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
        >
          {voting ? <LoaderCircle size={16} className="animate-spin" /> : <ThumbsUp size={16} />}
          {feature.votes}
        </button>
      ) : (
        <div className="flex h-fit shrink-0 flex-col items-center px-2 text-sm font-semibold text-gray-500" title="Votes">
          <ThumbsUp size={16} />
          {feature.votes}
        </div>
      )}
    </article>
  )
}

export default FeatureCard
