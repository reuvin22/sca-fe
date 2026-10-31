import { useState } from 'react'
import AuthHeader from '../../components/common/AuthHeader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import TextLink from '../../components/ui/TextLink'
import useRequest from '../../hooks/useRequest'
import { forgotPassword } from '../../services/authService'
import { isEmail } from '../../utils/validators'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sent, setSent] = useState(false)
  const { run, loading, error } = useRequest(forgotPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isEmail(email)) return setEmailError('Enter a valid email.')
    setEmailError('')
    setSent(Boolean(await run(email)))
  }

  return (
    <>
      <AuthHeader title="Forgot password?" subtitle="We'll send you a link to reset it" />

      {sent ? (
        <Alert type="success">If an account exists for {email}, you'll get an email with a reset link.</Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Alert>{error}</Alert>
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />
          <Button type="submit" loading={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        <TextLink to="/login">Back to sign in</TextLink>
      </p>
    </>
  )
}

export default ForgotPasswordPage
