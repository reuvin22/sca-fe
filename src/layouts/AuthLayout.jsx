import { Outlet, useLocation } from 'react-router-dom'
import AuthArt from '../components/auth/AuthArt'

// Greeting on the decorative panel for each page (others use the default)
const GREETINGS = {
  '/login': { title: 'Welcome back.', message: "Sign in to pick up where you left off. Your students' records are safe and encrypted." },
  '/register': { title: 'Join SCA.', message: 'Create your account to keep cases, appointments and files in one secure place.' },
  '/dev-register': { title: 'Hello, dev.', message: 'Join the team that builds and improves SCA.' },
}
const DEFAULT_GREETING = { title: 'Hi there.', message: 'Almost there. Follow the steps to get back into your account.' }

// Split card: the form on the left, a slanted gradient panel on the right (a strip on top on phones).
// Registration has more fields (address), so its card and form column are wider.
function AuthLayout() {
  const { pathname } = useLocation()
  const wide = pathname === '/register'
  const greeting = GREETINGS[pathname] ?? DEFAULT_GREETING

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8">
      <div
        className={`grid w-full grid-cols-1 overflow-hidden rounded-2xl bg-surface shadow-xl md:min-h-[540px] ${
          wide ? 'max-w-6xl md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]' : 'max-w-4xl md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'
        }`}
      >
        {/* Phones: a short gradient strip with the greeting above the form */}
        <div
          className="px-6 py-6 text-white md:hidden"
          style={{ background: 'linear-gradient(120deg, #8b5cf6, #4f46e5 60%, #06b6d4)' }}
        >
          <p className="text-2xl font-extrabold tracking-tight">{greeting.title}</p>
          <p className="mt-1 text-sm text-white/85">{greeting.message}</p>
        </div>

        <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10">
          <div className={`w-full ${wide ? '' : 'max-w-sm'}`}>
            <Outlet />
          </div>
        </div>

        <AuthArt className="hidden md:block" title={greeting.title} message={greeting.message} />
      </div>
    </main>
  )
}

export default AuthLayout
