import { Menu } from 'lucide-react'
import Card from '../ui/Card'
import ProgressRing from '../ui/ProgressRing'

function ProgressCard({ items, title = 'Case Overview' }) {
  return (
    <Card title={title} icon={Menu}>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center">
            <ProgressRing value={item.value} color={item.color} size={90}>
              <span className="text-2xl font-bold text-gray-800">{item.value}%</span>
            </ProgressRing>
            <p className="mt-3 text-sm font-semibold text-gray-800 uppercase">{item.label}</p>
            <p className="text-xs text-gray-400">{item.note}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ProgressCard
