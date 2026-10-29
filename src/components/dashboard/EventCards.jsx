import { CalendarDays } from 'lucide-react'
import { FOLLOW_UP, getCaseStatus } from '../../utils/caseHelpers'
import { formatDate } from '../../utils/dateHelpers'

// Upcoming case follow-ups. `events` is a list of cases.
// Cards match the appointment calendar design. Clicking one calls `onSelect(case)`.
function EventCards({ events, onSelect }) {
  return (
    <section className="rounded-xl bg-surface p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Upcoming Follow-ups</h2>

      {events.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">No upcoming follow-ups.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {events.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className={`w-full cursor-pointer rounded-lg border border-l-4 border-gray-200 bg-surface p-3 text-left text-xs shadow-sm hover:shadow-md ${FOLLOW_UP[getCaseStatus(item)]?.accent}`}
              >
              <p className="truncate text-sm font-semibold">{item.learnerName}</p>
              <p className="mt-1 flex items-center gap-1 text-gray-600">
                <CalendarDays size={12} className="shrink-0" />
                {formatDate(item.followUpDate)}
              </p>
              <p className="mt-1 text-gray-500">{item.caseNumber}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default EventCards
