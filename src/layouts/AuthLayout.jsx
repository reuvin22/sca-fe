import { Outlet, useMatch } from 'react-router-dom'

function AuthLayout() {
  // Registration has more fields (address), so its card is wider
  const wide = useMatch('/register')

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8">
      <div className={`w-full rounded-xl bg-surface p-6 shadow-sm sm:p-8 ${wide ? 'max-w-2xl' : 'max-w-sm'}`}>
        <Outlet />
      </div>
    </main>
  )
}

export default AuthLayout
