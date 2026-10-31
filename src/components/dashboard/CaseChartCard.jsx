import { useState } from 'react'
import MonthlyChartCard from './MonthlyChartCard'

const FILTERS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
]

// Cases bar chart with a Weekly / Monthly / Annual filter.
// `series`: { weekly, monthly, annual }, each [{ label, count }]
function CaseChartCard({ series }) {
  const [period, setPeriod] = useState('monthly')
  const bars = series[period].map(({ label, count }) => ({ month: label, count, color: 'bg-primary' }))

  const filters = (
    <div className="flex gap-1" role="tablist" aria-label="Cases period">
      {FILTERS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={period === option.value}
          onClick={() => setPeriod(option.value)}
          className={`cursor-pointer rounded-md border px-2.5 py-1 text-xs whitespace-nowrap ${period === option.value ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )

  return <MonthlyChartCard title="Cases" months={bars} action={filters} />
}

export default CaseChartCard
