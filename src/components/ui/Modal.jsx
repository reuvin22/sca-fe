import { X } from 'lucide-react'

function Modal({ title, onClose, children, className = 'max-w-lg' }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-xl bg-surface p-6 shadow-lg ${className}`}
      >
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100" aria-label="Close">
            <X size={18} />
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}

export default Modal
