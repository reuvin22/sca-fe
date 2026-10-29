import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, Share } from 'lucide-react'
import Skeleton from '../ui/Skeleton'
import { APPOINTMENT_STATUS, TIME_OPTIONS } from '../../utils/appointmentHelpers'
import { addDays, formatTime, startOfWeek, toDateString } from '../../utils/dateHelpers'

const SLOT_HEIGHT = 64 // px for one 30-minute slot

// Height in px based on duration (minimum one slot)
const getHeight = (duration) => (Math.max(parseInt(duration) || 30, 30) / 30) * SLOT_HEIGHT

const dayLabel = (iso, options) => new Date(`${iso}T00:00`).toLocaleDateString('en-US', options)

// Week view. Drag an appointment to another slot to change its date and time.
function AppointmentCalendar({ appointments, loading, onSelect, onMove }) {
  const today = toDateString()
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today))
  const [dropTarget, setDropTarget] = useState('')
  const [dragging, setDragging] = useState(false)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Delayed so the browser can start the drag first
  const startDrag = (e, id) => {
    e.dataTransfer.setData('text/plain', id)
    setTimeout(() => setDragging(true))
  }

  const stopDrag = () => {
    setDragging(false)
    setDropTarget('')
  }

  const handleDrop = (e, date, time) => {
    e.preventDefault()
    stopDrag()
    onMove(e.dataTransfer.getData('text/plain'), date, time)
  }

  if (loading) return <Skeleton className="m-4 h-96" />

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="mr-2 font-semibold text-gray-900">{dayLabel(weekStart, { month: 'long', year: 'numeric' })}</h2>
        <button type="button" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))} className="cursor-pointer rounded-md border border-gray-200 p-1 hover:bg-gray-50">
          <ChevronLeft size={16} />
        </button>
        <button type="button" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))} className="cursor-pointer rounded-md border border-gray-200 p-1 hover:bg-gray-50">
          <ChevronRight size={16} />
        </button>
        <button type="button" onClick={() => setWeekStart(startOfWeek(today))} className="cursor-pointer rounded-md border border-gray-200 px-2 py-0.5 text-sm hover:bg-gray-50">
          Today
        </button>
      </div>

      {/* Scrolls sideways on small screens */}
      <div className="overflow-x-auto">
        <div className="grid min-w-245 grid-cols-[4rem_repeat(7,minmax(0,1fr))]">
          <div />
          {days.map((day) => (
            <div key={day} className="border-b border-gray-200 pb-2 text-center">
              <p className="text-xs text-gray-500">{dayLabel(day, { weekday: 'short' })}</p>
              <p className={`mx-auto mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm ${day === today ? 'bg-primary text-white' : 'text-gray-900'}`}>
                {dayLabel(day, { day: 'numeric' })}
              </p>
            </div>
          ))}

          {/* Time labels */}
          <div>
            {TIME_OPTIONS.map(({ value, label }, i) => (
              <p key={value} style={{ height: SLOT_HEIGHT }} className="-mt-2 pr-2 text-right text-xs text-gray-400">
                {i % 2 === 0 && label}
              </p>
            ))}
          </div>

          {days.map((day) => (
            <div key={day} className="relative border-l border-gray-200">
              {TIME_OPTIONS.map(({ value }) => (
                <div
                  key={value}
                  style={{ height: SLOT_HEIGHT }}
                  className={`border-b border-gray-100 ${dropTarget === `${day} ${value}` ? 'bg-brand-50' : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => setDropTarget(`${day} ${value}`)}
                  onDrop={(e) => handleDrop(e, day, value)}
                />
              ))}

              {appointments
                .filter((item) => item.date === day)
                .map((item) => {
                  const slot = TIME_OPTIONS.findIndex((option) => option.value === item.time)
                  if (slot === -1) return null
                  return (
                    <button
                      key={item.id}
                      type="button"
                      draggable
                      onDragStart={(e) => startDrag(e, item.id)}
                      onDragEnd={stopDrag}
                      onClick={() => onSelect(item)}
                      style={{ top: slot * SLOT_HEIGHT, height: getHeight(item.duration) }}
                      className={`absolute inset-x-1 cursor-grab overflow-hidden rounded-lg border border-l-4 border-gray-200 bg-surface p-2 text-left text-xs shadow-sm active:cursor-grabbing ${dragging ? 'pointer-events-none opacity-60' : ''} ${APPOINTMENT_STATUS[item.status]?.accent}`}
                    >
                      <span className="flex items-start justify-between gap-1">
                        <span className="truncate text-sm font-semibold">{item.studentName}</span>
                        {/* Placeholder until sharing is available */}
                        <span className="shrink-0 rounded-full bg-gray-100 p-1 text-gray-500">
                          <Share size={10} />
                        </span>
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-gray-600">
                        <Clock size={12} className="shrink-0" />
                        <span className="truncate">{formatTime(item.time)} · {item.duration || '30 minutes'}</span>
                      </span>
                    </button>
                  )
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AppointmentCalendar
