import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import Calendar from './Calendar'
import CalendarPopover from './CalendarPopover'
import { fieldClass } from '../../utils/styles'
import { formatDate } from '../../utils/dateHelpers'

// Single date form field. Calls onChange with an input-like event so it works with useForm.
function DatePicker({ label, id, value, onChange, error, placeholder = 'Select date' }) {
  const [anchor, setAnchor] = useState(null)

  const handleSelect = (day) => {
    onChange({ target: { name: id, value: day } })
    setAnchor(null)
  }

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        onClick={(e) => setAnchor(e.currentTarget.getBoundingClientRect())}
        className={`flex cursor-pointer items-center justify-between text-left ${fieldClass(error)}`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value ? formatDate(value) : placeholder}</span>
        <CalendarDays size={16} className="text-gray-400" />
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}

      {anchor && (
        <CalendarPopover anchor={anchor} onClose={() => setAnchor(null)}>
          <Calendar from={value} onSelect={handleSelect} />
        </CalendarPopover>
      )}
    </div>
  )
}

export default DatePicker
