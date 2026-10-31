import { useState } from 'react'
import { toast } from 'react-toastify'
import AuthHeader from '../common/AuthHeader'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import useRequest from '../../hooks/useRequest'
import { resendLoginCode, verifyLoginCode } from '../../services/authService'
import WaitingNotice from '../../components/common/WaitingNotice'

// Second sign-in step (two-factor authentication): the 6-digit code emailed after the password.
// `pending` is { challenge, email } from the first step; `onSignedIn` gets { token, profile }.
function LoginCodeForm({ pending, onSignedIn, onBack }) {
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const verify = useRequest(verifyLoginCode)
  const resend = useRequest(resendLoginCode)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(code)) return setCodeError('Enter the 6-digit code from your email.')
    setCodeError('')
    onSignedIn(await verify.run({ challenge: pending.challenge, code }))
  }

  const handleResend = async () => {
    if (await resend.run(pending.challenge)) toast.success('A new code was sent')
  }

  // Digits only, at most 6 (also when pasting "123 456")
  const handleChange = (e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))

  return (
    <>
      <AuthHeader title="Check your email" subtitle={`We sent a 6-digit sign-in code to ${pending.email}`} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Alert>{verify.error || resend.error}</Alert>
        <Input
          label="Sign-in code"
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          autoFocus
          value={code}
          onChange={handleChange}
          error={codeError}
        />
        <Button type="submit" loading={verify.loading}>
          {verify.loading ? 'Checking...' : 'Sign in'}
        </Button>
        <WaitingNotice active={verify.loading || resend.loading} />
      </form>

      <div className="mt-6 flex items-center justify-between text-sm">
        <button type="button" onClick={onBack} className="cursor-pointer text-gray-600 hover:text-gray-900">
          Use another account
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={resend.loading}
          className="cursor-pointer font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50"
        >
          {resend.loading ? 'Sending...' : 'Send a new code'}
        </button>
      </div>
    </>
  )
}

export default LoginCodeForm
