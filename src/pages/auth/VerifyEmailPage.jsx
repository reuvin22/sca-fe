import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CircleCheck, CircleX } from 'lucide-react'
import AuthHeader from '../../components/common/AuthHeader'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import TextLink from '../../components/ui/TextLink'
import { verifyEmail } from '../../services/authService'
import { signIn } from '../../store/authSlice'

// Opened from the private link in the confirmation email. Confirms the email and signs the user in.
function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  // The link works only once, so verify once (React StrictMode runs effects twice in development)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    verifyEmail(token)
      .then((session) => {
        dispatch(signIn(session))
        setStatus('success')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [token, dispatch])

  if (status === 'loading') {
    return (
      <div className="space-y-3">
        <Skeleton className="mx-auto h-12 w-12 rounded-full" />
        <Skeleton className="mx-auto h-7 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <>
        <CircleX size={48} className="mx-auto mb-4 text-red-500" aria-hidden="true" />
        <AuthHeader title="Confirmation failed" />
        <div className="space-y-4 text-center">
          <Alert>{error}</Alert>
          <p className="text-sm text-gray-500">
            Already confirmed? <TextLink to="/login">Go to sign in</TextLink>
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <CircleCheck size={48} className="mx-auto mb-4 text-green-600" aria-hidden="true" />
      <AuthHeader title="Email verified" subtitle="Your account is now active and you're signed in." />
      <div className="space-y-4 text-center">
        <Button onClick={() => navigate('/dashboard', { replace: true })}>Continue to dashboard</Button>
        <p className="text-sm text-gray-500">
          Not you? <TextLink to="/login">Go to sign in</TextLink>
        </p>
      </div>
    </>
  )
}

export default VerifyEmailPage
