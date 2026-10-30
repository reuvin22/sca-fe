import { LoaderCircle, ThumbsUp } from 'lucide-react'
import Badge from '../ui/Badge'
import { REVIEW } from '../../utils/reportBoardHelpers'
import { formatDate } from '../../utils/dateHelpers'

// One feature request: rank (#1 has the most votes among approved), status, votes.
// `compact` is the smaller card used in "Your requests". `onVote` is only used for approved requests.
function FeatureCard({ feature, onVote, voting, compact = false }) {
  const approved = feature.review === 'approved'

  return (
    <article className={`flex gap-3 rounded-lg border border-gray-200 bg-surface ${compact ? 'p-3' : 'p-4'}`}>
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
          {feature.mine && !compact && <Badge label="Yours" className="bg-brand-50 text-brand-700" />}
        </div>
        {!compact && <p className="mt-1 line-clamp-3 text-sm whitespace-pre-wrap text-gray-600">{feature.description}</p>}
        <p className="mt-1 text-xs text-gray-400">{formatDate(feature.createdAt.slice(0, 10))}</p>
      </div>

      {/* Vote button (approved) or just the count */}
      {approved && onVote ? (
        <button
          type="button"
          onClick={() => onVote(feature)}
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
