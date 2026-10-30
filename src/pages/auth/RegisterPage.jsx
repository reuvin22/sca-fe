import { useNavigate } from 'react-router-dom'
import AuthHeader from '../../components/common/AuthHeader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import TextLink from '../../components/ui/TextLink'
import AddressFields from '../../components/common/AddressFields'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'
import { validateRegister } from '../../utils/validators'
import { emptyAddress } from '../../utils/addressHelpers'

function RegisterPage() {
  const navigate = useNavigate()
  const { form, errors, setErrors, handleChange } = useForm({
    fullName: '',
    email: '',
    phone: '',
    address: emptyAddress,
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Full name" id="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
          </div>
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="you@school.edu"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Mobile number"
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="0917 123 4567"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-gray-700">Address</legend>
          <AddressFields
            value={form.address}
            onChange={(address) => handleChange({ target: { name: 'address', value: address } })}
            errors={errors.address}
          />
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Password"
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
        </div>
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
