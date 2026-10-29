import { FOLLOW_UP, getFollowUpStatus } from '../../utils/caseHelpers'

function FollowUpBadge({ date }) {
  const { label, className } = FOLLOW_UP[getFollowUpStatus(date)]
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{label}</span>
}

export default FollowUpBadge
