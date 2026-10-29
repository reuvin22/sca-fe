import { useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import TodoCard from './TodoCard'

// One board column. Dropping on empty space moves the card to the end.
function TodoColumn({ column, cards, onEdit, onAddCard, onOpenCard, onMoveCard }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    setDragOver(false)
    if (e.defaultPrevented) return // dropped on a card
    e.preventDefault()
    onMoveCard(e.dataTransfer.getData('text/plain'), column.id)
  }

  // Ignores leaving into the column's own children
  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false)
  }

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group flex w-72 shrink-0 flex-col rounded-md p-2 transition ${dragOver ? 'bg-brand-50' : 'bg-gray-100'}`}
    >
      <header className="flex items-center gap-2 px-2 pt-1 pb-3">
        <h2 className="truncate text-xs font-semibold tracking-wide text-gray-500 uppercase">{column.title}</h2>
        <span className="text-xs text-gray-500">{cards.length}</span>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${column.title}`}
          className="ml-auto cursor-pointer rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Pencil size={14} />
        </button>
      </header>

      {/* Cards scroll inside the column when they don't fit */}
      <div className="flex min-h-0 flex-col gap-1.5 overflow-y-auto">
        {cards.map((card) => (
          <TodoCard key={card.id} card={card} onOpen={onOpenCard} onDropCard={(cardId, beforeId) => onMoveCard(cardId, column.id, beforeId)} />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddCard}
        className="mt-1.5 flex cursor-pointer items-center gap-1 rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
      >
        <Plus size={16} />
        Create
      </button>
    </section>
  )
}

export default TodoColumn
