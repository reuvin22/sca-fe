import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AuthHeader from '../../components/common/AuthHeader'
import Alert from '../../components/ui/Alert'
import Skeleton from '../../components/ui/Skeleton'
import TextLink from '../../components/ui/TextLink'
import { verifyEmail } from '../../services/authService'

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [token])

  if (status === 'loading') {
    return (
      <div className="space-y-3">
        <Skeleton className="mx-auto h-7 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  const success = status === 'success'

  return (
    <>
      <AuthHeader title={success ? 'Email confirmed' : 'Confirmation failed'} />
      <div className="space-y-4 text-center">
        {success ? (
          <Alert type="success">Your account is now active. You can sign in.</Alert>
        ) : (
          <Alert>{error}</Alert>
        )}
        <p className="text-sm text-gray-500">
          <TextLink to={success ? '/login' : '/register'}>
            {success ? 'Go to sign in' : 'Back to register'}
          </TextLink>
        </p>
      </div>
    </>
  )
}

export default VerifyEmailPage
