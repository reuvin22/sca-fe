import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import Button from './Button'
import Calendar from './Calendar'
import CalendarPopover from './CalendarPopover'
import { fieldClass } from '../../utils/styles'
import { formatDate, formatTime } from '../../utils/dateHelpers'

// One field for a date ("YYYY-MM-DD") and a time ("HH:MM"), saved as two form fields.
// Opens the calendar with a time picker below it. Calls onChange with input-like events
// ({ target: { name, value } }) for `dateId` and `timeId`, so it works with useForm.
function DateTimePicker({ label, dateId, timeId, date, time, onChange, error, placeholder = 'Select date & time' }) {
  const [anchor, setAnchor] = useState(null)
  const emit = (name, value) => onChange({ target: { name, value } })

  const text = [date && formatDate(date), time && formatTime(time)].filter(Boolean).join(' · ')

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={dateId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <button
        type="button"
        id={dateId}
        onClick={(e) => setAnchor(e.currentTarget.getBoundingClientRect())}
        className={`flex cursor-pointer items-center justify-between text-left ${fieldClass(error)}`}
      >
        <span className={text ? 'text-gray-900' : 'text-gray-400'}>{text || placeholder}</span>
        <CalendarClock size={16} className="text-gray-400" />
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}

      {anchor && (
        <CalendarPopover anchor={anchor} onClose={() => setAnchor(null)} height={470}>
          <Calendar from={date} onSelect={(day) => emit(dateId, day)} />
          <div className="mt-4 space-y-1 border-t border-gray-100 pt-4">
            <label htmlFor={timeId} className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              id={timeId}
              type="time"
              value={time}
              onChange={(e) => emit(timeId, e.target.value)}
              className={`cursor-pointer ${fieldClass(false)}`}
            />
          </div>
          <Button className="mt-4" onClick={() => setAnchor(null)}>
            Done
          </Button>
        </CalendarPopover>
      )}
    </div>
  )
}

export default DateTimePicker
