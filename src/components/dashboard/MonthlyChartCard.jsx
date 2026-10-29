import { LayoutGrid } from 'lucide-react'
import Card from '../ui/Card'

// Each bar is a stack of dashes; `value` is the number of dashes.
function MonthlyChartCard({ months }) {
  return (
    <Card title="Monthly Sessions" icon={LayoutGrid}>
      <div className="flex h-44 items-end justify-between gap-3">
        {months.map(({ month, value, color }) => (
          <div key={month} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full max-w-10 flex-col gap-1.5">
              {Array.from({ length: value }, (_, i) => (
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
