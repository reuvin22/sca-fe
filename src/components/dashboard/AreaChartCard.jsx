import { TrendingUp } from 'lucide-react'
import Card from '../ui/Card'
import RingRow from './RingRow'

const WIDTH = 300
const HEIGHT = 120
const MAX = 500

function AreaChartCard({ labels, values, rings }) {
  const step = WIDTH / (values.length - 1)
  const points = values.map((v, i) => `${i * step},${HEIGHT - (v / MAX) * HEIGHT}`).join(' L')

  return (
    <Card title="Weekly Activity" icon={TrendingUp}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="h-36 w-full">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d={`M0,${HEIGHT} L${points} L${WIDTH},${HEIGHT} Z`} fill="url(#areaFill)" />
        <path d={`M${points}`} fill="none" stroke="#fb923c" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-xs text-gray-400 uppercase">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <RingRow rings={rings} />
    </Card>
  )
}

export default AreaChartCard
