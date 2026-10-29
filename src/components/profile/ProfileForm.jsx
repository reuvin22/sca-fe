import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Card from '../ui/Card'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import FormField from '../common/FormField'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { setProfile } from '../../store/authSlice'
import { updateProfile } from '../../services/authService'
import { COUNSELOR_FIELD, PERSONAL_FIELDS, SCHOOL_FIELDS, pickFields } from '../../utils/profileHelpers'
import { validateProfile } from '../../utils/validators'

// Personal and school details as editable fields, saved together.
// `onDone` is called after saving or cancelling.
function ProfileForm({ onDone }) {
  const dispatch = useDispatch()
  const { user, school } = useSelector((state) => state.auth)
  const initial = { ...user, ...school } // field ids don't overlap
  const { form, errors, setErrors, handleChange } = useForm(initial)
  const save = useRequest(updateProfile)

  const changed = Object.keys(initial).some((key) => form[key] !== initial[key])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateProfile(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    const result = await save.run({ user: pickFields(form, PERSONAL_FIELDS), school: pickFields(form, SCHOOL_FIELDS) })
    if (result) {
      dispatch(setProfile(result))
      toast.success('Profile updated')
      onDone()
    }
  }

  const renderFields = (fields) =>
    fields.map(({ id, label, type }) => (
      <FormField key={id} label={label} id={id} type={type} value={form[id]} onChange={handleChange} error={errors[id]} />
    ))

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <Card title="Personal Details">
        <div className="grid gap-4 sm:grid-cols-2">{renderFields(PERSONAL_FIELDS)}</div>
      </Card>

      <Card title="School Details">
        <div className="grid gap-4 sm:grid-cols-2">
          {renderFields(SCHOOL_FIELDS)}
          {/* Always the same as Full Name */}
          <Input label={COUNSELOR_FIELD.label} id={COUNSELOR_FIELD.id} value={form.fullName} disabled title="Matches your Full Name" />
        </div>
      </Card>

      <Alert>{save.error}</Alert>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" fullWidth={false} disabled={save.loading} onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" fullWidth={false} loading={save.loading} disabled={!changed}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}

export default ProfileForm
