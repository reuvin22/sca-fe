import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toISO } from '../../utils/dateHelpers'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const navButton = 'cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700'
const pickClass = (active) =>
  `cursor-pointer rounded-lg py-2 text-sm transition ${
    active ? 'bg-brand-600 font-semibold text-white' : 'text-gray-600 hover:bg-gray-100'
  }`

// Month view. Highlights a single date (`from`) or a range (`from` to `to`).
// Click the title to jump by year or month instead of clicking the arrows many times.
function Calendar({ from = '', to = '', onSelect }) {
  const [month, setMonth] = useState(() => {
    const start = from ? new Date(`${from}T00:00`) : new Date()
    return new Date(start.getFullYear(), start.getMonth(), 1)
  })
  const [view, setView] = useState('days') // 'days' | 'months' | 'years'

  const year = month.getFullYear()
  const firstYear = year - (year % 12) // years page shows 12 years
  const daysInMonth = new Date(year, month.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => toISO(new Date(year, month.getMonth(), i + 1)))
  const today = toISO(new Date())
  const end = to || from

  // Arrows move by a month, a year, or 12 years depending on the view
  const step = { days: 1, months: 12, years: 144 }[view]
  const changeMonth = (offset) => setMonth(new Date(year, month.getMonth() + offset * step, 1))

  const title = {
    days: month.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    months: year,
    years: `${firstYear} – ${firstYear + 11}`,
  }[view]
  const nextView = { days: 'years', years: 'days', months: 'years' }[view]

  const pickYear = (y) => {
    setMonth(new Date(y, month.getMonth(), 1))
    setView('months')
  }
  const pickMonth = (m) => {
    setMonth(new Date(year, m, 1))
    setView('days')
  }

  const dayClass = (day) => {
    if (day === from || day === end) return 'bg-brand-600 font-semibold text-white'
    if (from && day > from && day < end) return 'bg-brand-100 text-brand-700'
    if (day === today) return 'font-semibold text-gray-900 ring-1 ring-gray-300'
    return 'text-gray-600 hover:bg-gray-100'
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => changeMonth(-1)} className={navButton} aria-label="Previous">
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => setView(nextView)}
          className="cursor-pointer rounded-lg px-2 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          {title}
        </button>
        <button type="button" onClick={() => changeMonth(1)} className={navButton} aria-label="Next">
          <ChevronRight size={18} />
        </button>
      </div>

      {view === 'years' && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {Array.from({ length: 12 }, (_, i) => firstYear + i).map((y) => (
            <button key={y} type="button" onClick={() => pickYear(y)} className={pickClass(y === year)}>
              {y}
            </button>
          ))}
        </div>
      )}

      {view === 'months' && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {MONTHS.map((name, i) => (
            <button key={name} type="button" onClick={() => pickMonth(i)} className={pickClass(i === month.getMonth())}>
              {name}
            </button>
          ))}
        </div>
      )}

      {view === 'days' && (
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
      )}
    </div>
  )
}

export default Calendar
