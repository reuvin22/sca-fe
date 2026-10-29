import { LayoutGrid } from 'lucide-react'
import Card from '../ui/Card'

const MAX_DASHES = 10

// Each bar is a stack of dashes, scaled so the busiest month has MAX_DASHES.
function MonthlyChartCard({ months, title = 'Monthly Cases' }) {
  const max = Math.max(...months.map((item) => item.count), 1)

  return (
    <Card title={title} icon={LayoutGrid}>
      <div className="flex h-44 items-end justify-between gap-3">
        {months.map(({ month, count, color }) => (
          <div key={month} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">{count}</span>
            <div className="flex w-full max-w-10 flex-col gap-1.5">
              {Array.from({ length: Math.round((count / max) * MAX_DASHES) }, (_, i) => (
                <span key={i} className={`h-1 rounded-full ${color}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400 uppercase">{month}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default MonthlyChartCard
