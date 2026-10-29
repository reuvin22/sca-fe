import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toISO } from '../../utils/dateHelpers'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const navButton = 'cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700'

// Month view. Highlights a single date (`from`) or a range (`from` to `to`).
function Calendar({ from = '', to = '', onSelect }) {
  const [month, setMonth] = useState(() => {
    const start = from ? new Date(`${from}T00:00`) : new Date()
    return new Date(start.getFullYear(), start.getMonth(), 1)
  })

  const year = month.getFullYear()
  const daysInMonth = new Date(year, month.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => toISO(new Date(year, month.getMonth(), i + 1)))
  const today = toISO(new Date())
  const end = to || from

  const changeMonth = (offset) => setMonth(new Date(year, month.getMonth() + offset, 1))

  const dayClass = (day) => {
    if (day === from || day === end) return 'bg-purple-600 font-semibold text-white'
    if (from && day > from && day < end) return 'bg-purple-100 text-purple-700'
    if (day === today) return 'font-semibold text-purple-600 ring-1 ring-purple-300'
    return 'text-gray-600 hover:bg-gray-100'
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => changeMonth(-1)} className={navButton} aria-label="Previous month">
          <ChevronLeft size={18} />
        </button>
        <p className="text-sm font-semibold text-gray-800">
          {month.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <button type="button" onClick={() => changeMonth(1)} className={navButton} aria-label="Next month">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-1 font-medium text-gray-400">{day}</span>
        ))}
        {Array.from({ length: month.getDay() }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => onSelect?.(day)}
            className={`flex aspect-square items-center justify-center rounded-lg transition ${onSelect ? 'cursor-pointer' : 'cursor-default'} ${dayClass(day)}`}
          >
            {Number(day.slice(-2))}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calendar
