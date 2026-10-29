import { useState } from 'react'

// Button that opens a floating panel. `children(close)` renders the panel content.
function Dropdown({ trigger, label, align = 'right', className = 'w-56', children }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
      >
        {trigger}
      </button>

      {open && (
        <>
          <div onClick={close} className="fixed inset-0 z-20" />
          <div
            className={`absolute z-30 mt-2 rounded-lg border border-gray-100 bg-surface py-1 shadow-lg ${align === 'right' ? 'right-0' : 'left-0'} ${className}`}
          >
            {children(close)}
          </div>
        </>
      )}
    </div>
  )
}

export default Dropdown
