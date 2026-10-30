import { useState } from 'react'
import { toast } from 'react-toastify'
import { Send } from 'lucide-react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import DataTable from '../../components/ui/DataTable'
import useFetch from '../../hooks/useFetch'
import useRequest from '../../hooks/useRequest'
import { getTeam, inviteDeveloper } from '../../services/teamService'
import { isEmail } from '../../utils/validators'

const COLUMNS = [
  { label: 'Name', value: (member) => member.name },
  { label: 'Email', value: (member) => member.email },
]

// Developers: who is on the team (can be assigned reports) and invitations by email
function DevTeamPage() {
  const team = useFetch(getTeam)
  const invite = useRequest(inviteDeveloper)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!isEmail(email)) return setEmailError('Enter a valid email.')
    setEmailError('')
    if (await invite.run(email.trim())) {
      toast.success(`Invitation sent to ${email.trim()}`)
      setEmail('')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
        <p className="text-sm text-gray-500">Developers on the team can be assigned reports.</p>
      </div>

      <Card title="Invite a developer">
        <form onSubmit={handleInvite} className="flex flex-col gap-2 sm:flex-row sm:items-start" noValidate>
          <div className="flex-1">
            <Input
              id="inviteEmail"
              type="email"
              aria-label="Developer email"
              placeholder="developer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />
          </div>
          <Button type="submit" fullWidth={false} loading={invite.loading}>
            {!invite.loading && <Send size={16} />}
            Send invitation
          </Button>
        </form>
        <p className="mt-2 text-xs text-gray-500">They'll get an email with a private link to create their developer account (valid for 72 hours).</p>
        <div className="mt-3">
          <Alert>{invite.error}</Alert>
        </div>
      </Card>

      <Card title="Team members">
        <div className="-mx-5 -mb-5">
          <Alert>{team.error}</Alert>
          <DataTable columns={COLUMNS} rows={team.data ?? []} loading={team.loading} emptyText="No developers yet." />
        </div>
      </Card>
    </div>
  )
}

export default DevTeamPage
