import { useNavigate } from 'react-router-dom'
import AuthHeader from '../../components/common/AuthHeader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import TextLink from '../../components/ui/TextLink'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'
import { validateRegister } from '../../utils/validators'

function RegisterPage() {
  const navigate = useNavigate()
  const { form, errors, setErrors, handleChange } = useForm({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { run, loading, error } = useRequest(register)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateRegister(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    const result = await run(form)
    if (result) navigate('/check-email', { state: { email: form.email } })
  }

  return (
    <>
      <AuthHeader title="Create an account" subtitle="Register to get started" />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Alert>{error}</Alert>
        <Input label="Full name" id="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
        <Input label="Email" id="email" type="email" placeholder="you@school.edu" value={form.email} onChange={handleChange} error={errors.email} />
        <Input label="Password" id="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
        <Input label="Confirm password" id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <Button type="submit" loading={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account? <TextLink to="/login">Sign in</TextLink>
      </p>
    </>
  )
}

export default RegisterPage
