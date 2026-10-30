import { createPortal } from 'react-dom'

const WIDTH = 288 // w-72

// Floating panel below (or above) the `anchor` rect. Rendered in <body> so modals don't clip it.
// `height` is about how tall the panel is, used to decide whether it fits below.
function CalendarPopover({ anchor, onClose, children, height = 360 }) {
  const left = Math.max(16, Math.min(anchor.left, window.innerWidth - WIDTH - 16))
  const fitsBelow = anchor.bottom + height < window.innerHeight
  const position = fitsBelow
    ? { top: anchor.bottom + 8, left }
    : { bottom: window.innerHeight - anchor.top + 8, left }

  return createPortal(
    <>
      <div onClick={onClose} className="fixed inset-0 z-50" />
      <div style={position} className="fixed z-50 w-72 rounded-xl border border-gray-100 bg-surface p-4 shadow-lg">
        {children}
      </div>
    </>,
    document.body,
  )
}

export default CalendarPopover
