import { Activity } from 'lucide-react'
import Card from '../ui/Card'
import RingRow from './RingRow'

function BarListCard({ bars, rings }) {
  return (
    <Card title="Top Concerns" icon={Activity}>
      <div className="space-y-3">
        {bars.length === 0 && <p className="text-sm text-gray-400">No cases yet.</p>}
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-3 text-xs">
            <span className="w-24 shrink-0 leading-tight font-medium break-words text-gray-600 uppercase sm:w-32" title={bar.label}>
              {bar.label}
            </span>
            <div className="h-1.5 flex-1 rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${bar.value}%` }}
              />
            </div>
            <span className="w-8 text-right text-gray-400">{bar.count}</span>
          </div>
        ))}
      </div>
      <RingRow rings={rings} unit="%" />
    </Card>
  )
}

export default BarListCard
