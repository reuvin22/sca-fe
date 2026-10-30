import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { toast } from 'react-toastify'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ConfirmModal from '../ui/ConfirmModal'
import DataTable from '../ui/DataTable'
import Pagination from '../ui/Pagination'
import usePaginatedList from '../../hooks/usePaginatedList'
import { activityService } from '../../services/activityService'
import { logoutEverywhere } from '../../services/authService'
import { signOut } from '../../store/authSlice'
import { formatDate, formatTime } from '../../utils/dateHelpers'

const ACTION_LABELS = {
  create: 'Added',
  update: 'Edited',
  delete: 'Deleted',
  download: 'Downloaded',
  'sign-in': 'Signed in',
  'sign-out': 'Signed out',
  'sign-out-all': 'Signed out of all devices',
  'password-reset': 'Reset password',
  'role-added': 'Joined the developer team',
}

const ENTITY_LABELS = { student: 'Student', case: 'Case', appointment: 'Appointment', file: 'File', account: 'Account' }

// "Jun 03, 2026 · 9:05 AM" in the user's time zone
function formatWhen(iso) {
  const date = new Date(iso)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()
  return `${formatDate(local.slice(0, 10))} · ${formatTime(local.slice(11, 16))}`
}

const COLUMNS = [
  { label: 'Activity', value: (row) => ACTION_LABELS[row.action] ?? row.action },
  { label: 'Record', value: (row) => ENTITY_LABELS[row.entity] ?? row.entity },
  { label: 'When', value: (row) => formatWhen(row.createdAt) },
]

const NO_FILTERS = {}

// Sign out of every device, and the user's own activity log so they can spot anything they didn't do
function SecurityCard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [confirming, setConfirming] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const activity = usePaginatedList(activityService, null, NO_FILTERS)

  const handleSignOutAll = async () => {
    setSigningOut(true)
    try {
      await logoutEverywhere()
    } catch (error) {
      setSigningOut(false)
      return toast.error(error.message)
    }
    navigate('/login', { replace: true })
    dispatch(signOut())
  }

  return (
    <Card title="Security">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Lost a device or see activity you don't recognize? Sign out everywhere, then change your password.
        </p>
        <Button type="button" variant="outline" fullWidth={false} onClick={() => setConfirming(true)}>
          <LogOut size={16} />
          Sign out of all devices
        </Button>
      </div>

      <h3 className="mt-6 mb-2 text-sm font-semibold text-gray-900">Recent activity</h3>
      <div className="overflow-hidden rounded-lg border border-gray-100">
        <DataTable columns={COLUMNS} rows={activity.items} loading={activity.loading} emptyText="No activity yet." />
        <Pagination pagination={activity.pagination} onPageChange={activity.setPage} />
      </div>

      {confirming && (
        <ConfirmModal
          title="Sign out of all devices?"
          message="You'll be signed out here and on every other device. You'll need to sign in again."
          confirmLabel="Sign out everywhere"
          loading={signingOut}
          onConfirm={handleSignOutAll}
          onClose={() => setConfirming(false)}
        />
      )}
    </Card>
  )
}

export default SecurityCard
