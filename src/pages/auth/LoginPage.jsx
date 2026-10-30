import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import AuthHeader from '../../components/common/AuthHeader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import TextLink from '../../components/ui/TextLink'
import LoginCodeForm from '../../components/auth/LoginCodeForm'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { finishGoogleRedirect, login, loginWithGoogle } from '../../services/authService'
import { signIn } from '../../store/authSlice'
import { validateLogin } from '../../utils/validators'
import googleIcon from '../../assets/google.svg'

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { form, errors, setErrors, handleChange } = useForm({ email: '', password: '' })
  const emailLogin = useRequest(login)
  const googleLogin = useRequest(loginWithGoogle)
  // Back from Google after a redirect sign-in: finish signing in (runs once, even in StrictMode)
  const googleReturn = useRequest(finishGoogleRedirect)
  const checkedRedirect = useRef(false)
  // After the password: { challenge, email } while waiting for the emailed code
  const [pending, setPending] = useState(null)
  const error = emailLogin.error || googleLogin.error || googleReturn.error
  const googleBusy = googleLogin.loading || googleReturn.loading
  const busy = emailLogin.loading || googleBusy

  // `session` is { token, profile }, or nothing to do (popup closed, redirecting, no redirect result)
  const finishSignIn = useCallback(
    (session) => {
      if (!session?.token) return
      dispatch(signIn(session))
      navigate('/dashboard', { replace: true })
    },
    [dispatch, navigate],
  )

  const runGoogleReturn = googleReturn.run
  useEffect(() => {
    if (checkedRedirect.current) return
    checkedRedirect.current = true
    runGoogleReturn().then(finishSignIn)
  }, [runGoogleReturn, finishSignIn])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateLogin(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return
    const result = await emailLogin.run(form)
    if (result?.codeRequired) setPending(result)
  }

  const handleGoogle = async () => finishSignIn(await googleLogin.run())

  if (pending) return <LoginCodeForm pending={pending} onSignedIn={finishSignIn} onBack={() => setPending(null)} />

  return (
    <>
      <AuthHeader
        title="Sign in"
        subtitle={
          <>
            Don't have an account? <TextLink to="/register">Create your account</TextLink>
          </>
        }
      />

      <Button type="button" variant="outline" onClick={handleGoogle} loading={googleBusy} disabled={busy}>
        {!googleBusy && <img src={googleIcon} alt="" width="18" height="18" />}
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
    </>
  )
}

export default LoginPage
