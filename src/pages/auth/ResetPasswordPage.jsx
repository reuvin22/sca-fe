import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AuthHeader from '../../components/common/AuthHeader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import TextLink from '../../components/ui/TextLink'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { resetPassword } from '../../services/authService'
import { validatePassword } from '../../utils/validators'

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [done, setDone] = useState(false)
  const { form, errors, setErrors, handleChange } = useForm({ password: '', confirmPassword: '' })
  const { run, loading, error } = useRequest(resetPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validatePassword(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return
    setDone(Boolean(await run(token, form.password)))
  }

  return (
    <>
      <AuthHeader title="Reset password" subtitle="Enter your new password" />

      {done ? (
        <Alert type="success">Your password has been reset. You can now sign in.</Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Alert>{error}</Alert>
          <Input
            label="New password"
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Input
            label="Confirm password"
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <Button type="submit" loading={loading}>
            {loading ? 'Saving...' : 'Reset password'}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        <TextLink to="/login">Back to sign in</TextLink>
      </p>
    </>
  )
}

export default ResetPasswordPage
