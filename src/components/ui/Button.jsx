import { LoaderCircle } from 'lucide-react'

const variants = {
  primary: 'bg-gray-900 text-white hover:bg-gray-800',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

// `loading` shows a spinner and disables the button (use for API calls).
function Button({ variant = 'primary', fullWidth = true, loading = false, disabled, className = '', children, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={`flex ${fullWidth ? 'w-full' : 'shrink-0'} cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      {children}
    </button>
  )
}

export default Button
