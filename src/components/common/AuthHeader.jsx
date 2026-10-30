// Page title on the sign-in / register card. `subtitle` can include a link.
function AuthHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}

export default AuthHeader
