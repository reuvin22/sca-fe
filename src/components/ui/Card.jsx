// `action` replaces the header icon (e.g. a delete button).
function Card({ title, icon: Icon, action, children, className = '' }) {
  return (
    <section className={`rounded-xl bg-surface p-5 shadow-sm ${className}`}>
      {title && (
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">{title}</h2>
          {action ?? (Icon && <Icon size={18} className="text-gray-300" />)}
        </header>
      )}
      {children}
    </section>
  )
}

export default Card
