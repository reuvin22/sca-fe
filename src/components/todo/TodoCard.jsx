import { CheckSquare } from 'lucide-react'
import { PRIORITIES } from '../../utils/todoHelpers'
import { formatDate, toDateString } from '../../utils/dateHelpers'

// Jira-style card. Dropping another card on it places that card above this one.
function TodoCard({ card, onOpen, onDropCard }) {
  const overdue = card.dueDate && card.dueDate < toDateString()
  const priority = PRIORITIES[card.priority] ?? PRIORITIES.medium
  const PriorityIcon = priority.icon

  const handleDrop = (e) => {
    e.preventDefault() // tells the column this drop is already handled
    onDropCard(e.dataTransfer.getData('text/plain'), card.id)
  }

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', card.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => onOpen(card)}
      className="w-full cursor-grab rounded-md bg-surface p-3 text-left shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 active:cursor-grabbing"
    >
      <p className="text-sm wrap-break-word text-gray-800">{card.title}</p>

      <div className="mt-3 flex items-center gap-2">
        <CheckSquare size={14} className="shrink-0 text-sky-500" />
        <span className="text-xs font-medium text-gray-500">{card.key}</span>

        <span className="ml-auto flex items-center gap-1.5">
          {card.dueDate && (
            <span className={`rounded px-1.5 py-0.5 text-[11px] ${overdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
              {formatDate(card.dueDate)}
            </span>
          )}
          <PriorityIcon size={16} className={priority.className} aria-label={`${priority.label} priority`} />
        </span>
      </div>
    </button>
  )
}

export default TodoCard
