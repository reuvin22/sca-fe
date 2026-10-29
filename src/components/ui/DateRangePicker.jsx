import { useState } from 'react'
import { CalendarDays, X } from 'lucide-react'
import Button from './Button'
import Calendar from './Calendar'
import CalendarPopover from './CalendarPopover'
import { formatDate } from '../../utils/dateHelpers'

// Button that opens a calendar. Click a start then an end date, or the same date twice for one day.
function DateRangePicker({ from, to, onChange }) {
  const [anchor, setAnchor] = useState(null)

  const handleSelect = (day) => {
    if (!from || to || day < from) return onChange({ from: day, to: '' })
    onChange({ from, to: day })
    setAnchor(null)
  }

  let label = 'Select dates'
  if (from) label = to && to !== from ? `${formatDate(from)} – ${formatDate(to)}` : formatDate(from)

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        fullWidth={false}
        onClick={(e) => setAnchor(e.currentTarget.getBoundingClientRect())}
        className="whitespace-nowrap"
      >
        <CalendarDays size={16} />
        {label}
      </Button>
      {from && (
        <button
          onClick={() => onChange({ from: '', to: '' })}
          className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          aria-label="Clear dates"
        >
          <X size={16} />
        </button>
      )}

      {anchor && (
        <CalendarPopover anchor={anchor} onClose={() => setAnchor(null)}>
          <Calendar from={from} to={to} onSelect={handleSelect} />
          <p className="mt-3 text-xs text-gray-400">Pick a start and end date, or the same date twice.</p>
        </CalendarPopover>
      )}
    </div>
  )
}

export default DateRangePicker
