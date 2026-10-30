import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import AuthHeader from '../../components/common/AuthHeader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import TextLink from '../../components/ui/TextLink'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { login, loginWithGoogle } from '../../services/authService'
import { signIn } from '../../store/authSlice'
import { validateLogin } from '../../utils/validators'
import googleIcon from '../../assets/google.svg'

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { form, errors, setErrors, handleChange } = useForm({ email: '', password: '' })
  const emailLogin = useRequest(login)
  const googleLogin = useRequest(loginWithGoogle)
  const error = emailLogin.error || googleLogin.error
  const busy = emailLogin.loading || googleLogin.loading

  // `session` is { token, profile }, or true when the Google popup was closed
  const finishSignIn = (session) => {
    if (!session?.token) return
    dispatch(signIn(session))
    navigate('/dashboard', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateLogin(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return
    finishSignIn(await emailLogin.run(form))
  }

  const handleGoogle = async () => finishSignIn(await googleLogin.run())

  return (
    <>
      <AuthHeader title="Welcome back" subtitle="Sign in to your account" />

      <Button type="button" variant="outline" onClick={handleGoogle} loading={googleLogin.loading} disabled={busy}>
        {!googleLogin.loading && <img src={googleIcon} alt="" width="18" height="18" />}
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
        <hr className="flex-1 border-gray-200" />
        OR
        <hr className="flex-1 border-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Alert>{error}</Alert>
        {/* Unconfirmed account: registering again won't work, so offer to resend the email */}
        {emailLogin.error.includes('confirm') && (
          <p className="text-sm text-gray-500">
            Didn't get the email?{' '}
            <TextLink to="/check-email" state={{ email: form.email }}>
              Resend confirmation
            </TextLink>
          </p>
        )}
        <Input label="Email" id="email" type="email" placeholder="you@school.edu" value={form.email} onChange={handleChange} error={errors.email} />
        <Input label="Password" id="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} error={errors.password} />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={emailLogin.loading} disabled={busy}>
          {emailLogin.loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account? <TextLink to="/register">Register</TextLink>
      </p>
    </>
  )
}

export default LoginPage
