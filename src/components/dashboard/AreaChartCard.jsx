import { TrendingUp } from 'lucide-react'
import Card from '../ui/Card'
import RingRow from './RingRow'

const WIDTH = 300
const HEIGHT = 120

// Area chart of cases per day. `days`: [{ label, count }]
function AreaChartCard({ days, rings }) {
  const max = Math.max(...days.map((day) => day.count), 1) * 1.2
  const step = WIDTH / (days.length - 1)
  const points = days.map((day, i) => `${i * step},${HEIGHT - (day.count / max) * HEIGHT}`).join(' L')

  return (
    <Card title="Weekly Intake" icon={TrendingUp}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="h-36 w-full text-primary">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={`M0,${HEIGHT} L${points} L${WIDTH},${HEIGHT} Z`} fill="url(#areaFill)" />
        <path d={`M${points}`} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-xs text-gray-400 uppercase">
        {days.map((day, i) => (
          <span key={i} title={`${day.count} case(s)`}>{day.label}</span>
        ))}
      </div>
      <RingRow rings={rings} unit="%" />
    </Card>
  )
}

export default AreaChartCard
