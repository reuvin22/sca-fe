import { CalendarDays } from 'lucide-react'
import Calendar from '../ui/Calendar'
import { formatDate, toDateString } from '../../utils/dateHelpers'

function CalendarCard() {
  return (
    <section className="rounded-xl bg-surface p-5 shadow-sm">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Calendar</h2>
          <p className="text-xs text-gray-400">{formatDate(toDateString())}</p>
        </div>
        <span className="rounded-lg bg-gray-100 p-2 text-gray-600">
          <CalendarDays size={18} />
        </span>
      </header>
      <Calendar />
    </section>
  )
}

export default CalendarCard
