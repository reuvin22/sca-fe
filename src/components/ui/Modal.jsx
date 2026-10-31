import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// Rendered in <body>, so the page around it (spacing, sticky bars, blur) can never move or clip it,
// and the dark backdrop always covers the whole screen. Less padding on phones.
function Modal({ title, onClose, children, className = 'max-w-lg' }) {
  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-2 sm:p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[92vh] w-full min-w-0 overflow-y-auto rounded-xl bg-surface p-4 shadow-lg sm:max-h-[90vh] sm:p-6 ${className}`}
      >
        <header className="mb-4 flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-lg font-semibold wrap-break-word text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
