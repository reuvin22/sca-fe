function Badge({ label, className }) {
  if (!label) return null
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${className}`}>{label}</span>
}

export default Badge
