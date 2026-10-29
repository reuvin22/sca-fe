import { Activity } from 'lucide-react'
import Card from '../ui/Card'
import RingRow from './RingRow'

function BarListCard({ bars, rings }) {
  return (
    <Card title="Top Concerns" icon={Activity}>
      <div className="space-y-3">
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-3 text-xs">
            <span className="w-16 font-medium text-gray-600 uppercase">{bar.label}</span>
            <div className="h-1.5 flex-1 rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-purple-500 to-fuchsia-500"
                style={{ width: `${bar.value}%` }}
              />
            </div>
            <span className="w-8 text-right text-gray-400">{bar.value}</span>
          </div>
        ))}
      </div>
      <RingRow rings={rings} unit="%" />
    </Card>
  )
}

export default BarListCard
