import { useState } from 'react'
import { CircleCheck } from 'lucide-react'
import Modal from '../ui/Modal'
import Select from '../ui/Select'
import Alert from '../ui/Alert'
import useRequest from '../../hooks/useRequest'

// Approve a feature request and pick who works on it. Only team developers can be chosen;
// the developer approving it is picked by default.
// `onApprove(assigneeId)` saves; throws on failure so the error shows here.
function ApproveFeatureModal({ feature, team, currentUserId, onApprove, onClose }) {
  // Default: you (if on the team), otherwise the first member. Follows the team list until someone is picked,
  // so it is right even if the team finishes loading after the window opens.
  const onTeam = team.some((member) => member.id === currentUserId)
  const [picked, setPicked] = useState(null)
  const assigneeId = picked ?? (onTeam ? currentUserId : (team[0]?.id ?? ''))
  const approve = useRequest(onApprove)

  const options = team.map((member) => ({
    value: member.id,
    label: member.id === currentUserId ? `${member.name} (you)` : member.name,
  }))

  const handleApprove = async () => {
    if (await approve.run(assigneeId)) onClose()
  }

  return (
    <Modal title="Approve & assign" onClose={approve.loading ? () => {} : onClose} className="max-w-md">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{feature.subject}</span> will be open for voting and assigned to:
        </p>
        {team.length === 0 ? (
          <Alert>No developers on the team yet. Invite one from the Team page.</Alert>
        ) : (
          <Select label="Assignee" id="approveAssignee" options={options} value={assigneeId} onChange={(e) => setPicked(e.target.value)} />
        )}
        <Alert>{approve.error}</Alert>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={approve.loading}
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={approve.loading || !assigneeId}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CircleCheck size={16} />
            {approve.loading ? 'Approving…' : 'Approve'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ApproveFeatureModal
