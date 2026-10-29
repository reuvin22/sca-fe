import Badge from '../ui/Badge'
import { FOLLOW_UP } from '../../utils/caseHelpers'

function FollowUpBadge({ status }) {
  if (!status) return null
  return <Badge {...FOLLOW_UP[status]} />
}

export default FollowUpBadge
