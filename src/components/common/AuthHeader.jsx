function AuthHeader({ title, subtitle }) {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}

export default AuthHeader
