import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProfileForm from '../../components/profile/ProfileForm'
import ProfileHeader from '../../components/profile/ProfileHeader'
import useProfileComplete from '../../hooks/useProfileComplete'
import { COUNSELOR_FIELD, PERSONAL_FIELDS, SCHOOL_FIELDS } from '../../utils/profileHelpers'

// Read-only label/value list
function DetailsCard({ title, fields, data }) {
  return (
    <Card title={title}>
      <dl className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ id, label }) => (
          <div key={id} className="min-w-0">
            <dt className="text-xs text-gray-500">{label}</dt>
            <dd className="text-sm font-medium wrap-break-word text-gray-900">{data[id] || '—'}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

function ProfilePage() {
  const user = useSelector((state) => state.auth.user)
  const school = useSelector((state) => state.auth.school)
  const navigate = useNavigate()
  // First sign-in: the form stays open until the required details are saved
  const mustComplete = !useProfileComplete()
  const [editing, setEditing] = useState(false)
  const showForm = editing || mustComplete

  // After completing the profile for the first time, open the system
  const handleDone = () => {
    setEditing(false)
    if (mustComplete) navigate('/dashboard', { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500">Your account and school information.</p>
        </div>
        {!showForm && (
          <Button fullWidth={false} onClick={() => setEditing(true)}>
            <Pencil size={16} />
            Edit Profile
          </Button>
        )}
      </div>

      <ProfileHeader />

      {mustComplete && (
        <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700">
          Welcome! Please complete your profile and school details to start using the system. Fields marked * are
          required.
        </p>
      )}

      {showForm ? (
        <ProfileForm onDone={handleDone} mustComplete={mustComplete} />
      ) : (
        <>
          <DetailsCard title="Personal Details" fields={PERSONAL_FIELDS} data={user} />
          <DetailsCard
            title="School Details"
            fields={[...SCHOOL_FIELDS, COUNSELOR_FIELD]}
            data={{ ...school, counselorAssociate: user.fullName }}
          />
        </>
      )}
    </div>
  )
}

export default ProfilePage
