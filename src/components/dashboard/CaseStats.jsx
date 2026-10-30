import { CalendarDays, CircleCheck, Clock, FolderOpen, Share2, TriangleAlert } from 'lucide-react'
import StatCard from './StatCard'
import { CASE_STAT_LABELS } from '../../utils/caseHelpers'

const cards = [
  { key: 'total', icon: FolderOpen },
  { key: 'forFollowUp', icon: Clock },
  { key: 'overdue', icon: TriangleAlert },
  { key: 'closed', icon: CircleCheck },
  { key: 'thisMonth', icon: CalendarDays },
  { key: 'referrals', icon: Share2 },
]

// `stats`: case totals from the backend ({ total, forFollowUp, overdue, closed, thisMonth, referrals })
function CaseStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-6">
      {cards.map(({ key, ...card }) => (
        <StatCard key={key} {...card} label={CASE_STAT_LABELS[key]} value={stats[key]} />
      ))}
    </div>
  )
}

export default CaseStats
