const types = {
  success: 'bg-green-50 text-green-700',
  error: 'bg-red-50 text-red-700',
}

function Alert({ type = 'error', children }) {
  if (!children) return null
  return <p className={`rounded-lg px-3 py-2 text-sm ${types[type]}`}>{children}</p>
}

export default Alert
