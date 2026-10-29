import Card from '../ui/Card'

// Horizontal bars scaled to the largest count. `bars`: [{ label, count }]
function CountBarsCard({ title, icon, bars, emptyText = 'No data yet.' }) {
  const max = Math.max(...bars.map((bar) => bar.count), 1)

  return (
    <Card title={title} icon={icon}>
      <div className="space-y-3">
        {bars.length === 0 && <p className="text-sm text-gray-400">{emptyText}</p>}
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-3 text-xs">
            <span className="w-32 truncate font-medium text-gray-600 uppercase sm:w-44" title={bar.label}>{bar.label}</span>
            <div className="h-1.5 flex-1 rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-brand-500 to-brand-400"
                style={{ width: `${(bar.count / max) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right text-gray-400">{bar.count}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default CountBarsCard
