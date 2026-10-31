import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import AuthHeader from '../../components/common/AuthHeader'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import TextLink from '../../components/ui/TextLink'
import useRequest from '../../hooks/useRequest'
import { resendConfirmation } from '../../services/authService'

function CheckEmailPage() {
  const email = useLocation().state?.email
  const [resent, setResent] = useState(false)
  const { run, loading, error } = useRequest(resendConfirmation)

  if (!email) return <Navigate to="/register" replace />

  const handleResend = async () => {
    setResent(Boolean(await run(email)))
  }

  return (
    <>
      <AuthHeader title="Check your email" />

      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600">
          We sent a confirmation link to <span className="font-medium text-gray-900">{email}</span>. Click the link to
          activate your account.
        </p>
        <Alert>{error}</Alert>
        {resent && <Alert type="success">Confirmation email sent again.</Alert>}
        <Button variant="outline" onClick={handleResend} loading={loading}>
          {loading ? 'Sending...' : 'Resend email'}
        </Button>
        <p className="text-sm text-gray-500">
          <TextLink to="/login">Back to sign in</TextLink>
        </p>
      </div>
    </>
  )
}

export default CheckEmailPage
