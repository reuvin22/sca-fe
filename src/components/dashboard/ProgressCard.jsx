import { Menu } from 'lucide-react'
import Card from '../ui/Card'
import ProgressRing from '../ui/ProgressRing'

// 3 rings in a row; 4 rings: 2 × 2 on phones, one row on wider screens
const COLUMNS = { 3: 'grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }

function ProgressCard({ items, title = 'Case Overview' }) {
  return (
    <Card title={title} icon={Menu}>
      <div className={`grid gap-2 sm:gap-4 ${COLUMNS[items.length] ?? 'grid-cols-3'}`}>
        {items.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col items-center text-center">
            <ProgressRing value={item.value} color={item.color} size={90}>
              <span className="text-lg font-bold text-gray-800 sm:text-2xl">{item.value}%</span>
            </ProgressRing>
            <p className="mt-3 text-xs font-semibold break-words text-gray-800 uppercase sm:text-sm">{item.label}</p>
            <p className="text-xs leading-tight text-gray-500">{item.note}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ProgressCard
