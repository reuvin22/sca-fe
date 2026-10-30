import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthHeader from '../../components/common/AuthHeader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import Skeleton from '../../components/ui/Skeleton'
import TextLink from '../../components/ui/TextLink'
import useFetch from '../../hooks/useFetch'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { getInvitation, registerDeveloper } from '../../services/authService'
import { signIn } from '../../store/authSlice'
import { validatePassword } from '../../utils/validators'

// Opened from the developer invitation email. Creates a developer account for the invited email.
function DevRegisterPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loadInvitation = useCallback(() => getInvitation(token), [token])
  const invitation = useFetch(loadInvitation)
  const { form, errors, setErrors, handleChange } = useForm({ fullName: '', password: '', confirmPassword: '' })
  const register = useRequest(registerDeveloper)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validatePassword(form)
    if (form.fullName.trim().length < 2) newErrors.fullName = 'Full name is required.'
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    const session = await register.run({ token, fullName: form.fullName.trim(), password: form.password })
    if (session) {
      dispatch(signIn(session))
      navigate('/dev/reports', { replace: true })
    }
  }

  if (invitation.loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="mx-auto h-7 w-2/3" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    )
  }

  if (invitation.error) {
    return (
      <>
        <AuthHeader title="Invitation not valid" />
        <div className="space-y-4 text-center">
          <Alert>{invitation.error}</Alert>
          <p className="text-sm text-gray-500">Ask a developer on the team to send you a new invitation.</p>
          <TextLink to="/login">Go to sign in</TextLink>
        </div>
      </>
    )
  }

  return (
    <>
      <AuthHeader title="Join the developer team" subtitle={`Create the developer account for ${invitation.data.email}`} />
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Alert>{register.error}</Alert>
        <Input label="Email" id="email" value={invitation.data.email} disabled />
        <Input label="Full name" id="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
        <Input label="Password" id="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
        <Input label="Confirm password" id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <Button type="submit" loading={register.loading}>
          {register.loading ? 'Creating account...' : 'Create developer account'}
        </Button>
      </form>
    </>
  )
}

export default DevRegisterPage
