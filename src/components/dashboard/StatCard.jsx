// Small screens: icon above the text so the label has room to wrap (no cut-off text)
function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-surface p-4 text-gray-900 shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <span className="w-fit shrink-0 rounded-lg bg-gray-100 p-2 text-gray-600 sm:p-2.5">
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-xs leading-tight font-medium tracking-wide break-words text-gray-500 uppercase sm:text-sm">{label}</p>
        <p className="mt-1 text-2xl font-bold sm:text-3xl">{value}</p>
      </div>
    </div>
  )
}

export default StatCard
