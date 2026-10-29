import { useState } from 'react'
import { CalendarDays, X } from 'lucide-react'
import Button from './Button'
import Calendar from './Calendar'
import { formatDate } from '../../utils/dateHelpers'

// Button that opens a calendar. Click a start then an end date, or the same date twice for one day.
function DateRangePicker({ from, to, onChange }) {
  const [open, setOpen] = useState(false)

  const handleSelect = (day) => {
    if (!from || to || day < from) return onChange({ from: day, to: '' })
    onChange({ from, to: day })
    setOpen(false)
  }

  let label = 'Select dates'
  if (from) label = to && to !== from ? `${formatDate(from)} – ${formatDate(to)}` : formatDate(from)

  return (
    <div className="relative flex items-center gap-1">
      <Button variant="outline" fullWidth={false} onClick={() => setOpen(!open)} className="whitespace-nowrap">
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

      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-20" />
          <div className="absolute top-full left-0 z-30 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
            <Calendar from={from} to={to} onSelect={handleSelect} />
            <p className="mt-3 text-xs text-gray-400">Pick a start and end date, or the same date twice.</p>
          </div>
        </>
      )}
    </div>
  )
}

export default DateRangePicker
