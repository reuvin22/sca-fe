import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <Outlet />
      </div>
    </main>
  )
}

export default AuthLayout
