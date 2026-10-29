import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import googleIcon from '../../assets/google.svg'

function LoginPage() {
  const navigate = useNavigate()
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
      </div>

      <Button type="button" variant="outline">
        <img src={googleIcon} alt="" width="18" height="18" />
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
        <hr className="flex-1 border-gray-200" />
        OR
        <hr className="flex-1 border-gray-200" />
      </div>

      <form className="space-y-4">
        <Input label="Email" id="email" type="email" placeholder="you@school.edu" />
        <Input label="Password" id="password" type="password" placeholder="••••••••" />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
            Forgot password?
          </Link>
        </div>

        <Link to='/dashboard'><Button type="submit">Sign in</Button></Link>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-gray-900 hover:underline">
          Register
        </Link>
      </p>
    </>
  )
}

export default LoginPage
