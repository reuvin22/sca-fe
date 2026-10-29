import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Pencil } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProfileForm from '../../components/profile/ProfileForm'
import { COUNSELOR_FIELD, PERSONAL_FIELDS, SCHOOL_FIELDS } from '../../utils/profileHelpers'
import { getInitials } from '../../utils/stringHelpers'

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
  const [editing, setEditing] = useState(false)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500">Your account and school information.</p>
        </div>
        {!editing && (
          <Button fullWidth={false} onClick={() => setEditing(true)}>
            <Pencil size={16} />
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-brand-600 text-2xl font-semibold text-white">
            {getInitials(user.fullName)}
          </span>
          <div>
            <p className="text-xl font-semibold text-gray-900">{user.fullName}</p>
            <p className="text-sm text-gray-500">
              {user.role} · {school.name}
            </p>
          </div>
        </div>
      </Card>

      {editing ? (
        <ProfileForm onDone={() => setEditing(false)} />
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
