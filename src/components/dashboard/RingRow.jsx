import ProgressRing from '../ui/ProgressRing'

// Row of small rings shown at the bottom of chart cards.
function RingRow({ rings, unit = '' }) {
  return (
    <div className="mt-6 flex justify-around">
      {rings.map((ring) => (
        <div key={ring.label} className="flex flex-col items-center gap-1">
          <ProgressRing value={ring.value} color={ring.color} size={56} stroke={5}>
            <span className="text-xs font-bold text-gray-700">
              {ring.value}
              {unit}
            </span>
          </ProgressRing>
          <span className="max-w-24 text-center text-xs font-medium text-gray-500 uppercase">{ring.label}</span>
        </div>
      ))}
    </div>
  )
}

export default RingRow
