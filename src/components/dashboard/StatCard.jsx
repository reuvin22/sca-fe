import { ArrowUpRight } from 'lucide-react'

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl bg-linear-to-br p-5 text-white shadow-sm ${color}`}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium tracking-wide uppercase opacity-90">{label}</p>
        <span className="rounded-md bg-white/25 p-1">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  )
}

export default StatCard
