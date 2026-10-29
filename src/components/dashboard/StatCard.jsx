function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-surface p-5 text-gray-900 shadow-sm">
      <span className="shrink-0 rounded-lg bg-gray-100 p-2.5 text-gray-600">
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium tracking-wide text-gray-500 uppercase" title={label}>{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  )
}

export default StatCard
