import { useState } from 'react'
import { Plus } from 'lucide-react'
import TodoColumn from '../../components/todo/TodoColumn'
import ColumnModal from '../../components/todo/ColumnModal'
import CardModal from '../../components/todo/CardModal'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import useTodoBoard from '../../hooks/useTodoBoard'
import { filterCards } from '../../utils/todoHelpers'

function TodoPage() {
  const { board, loading, error, addColumn, renameColumn, removeColumn, saveCard, removeCard, moveCard } =
    useTodoBoard()
  // undefined = closed, null = add, object = edit
  const [editColumn, setEditColumn] = useState(undefined)
  // null = closed. A card without an id is a new card.
  const [openCard, setOpenCard] = useState(null)
  const [search, setSearch] = useState('')

  const cardsOf = (columnId) => board.cards.filter((card) => card.columnId === columnId)
  const visibleCards = board ? filterCards(board.cards, search) : []

  return (
    // Fills the screen below the navbar (4rem) and page padding
    <div className="flex h-[calc(100dvh-6rem)] min-h-120 flex-col gap-6 sm:h-[calc(100dvh-7rem)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">To Do</h1>
          <p className="text-sm text-gray-500">Drag cards between columns to update their progress.</p>
        </div>
        <Button fullWidth={false} onClick={() => setEditColumn(null)} disabled={!board}>
          <Plus size={16} />
          Add Column
        </Button>
      </div>

      <Alert>{error}</Alert>

      <section className="flex min-h-0 flex-1 flex-col gap-4 rounded-xl bg-surface p-4 shadow-sm">
        <div className="w-full sm:w-56">
          <Input
            id="search"
            type="search"
            placeholder="Search board"
            aria-label="Search board"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Scrolls sideways when there are many columns */}
        <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-2">
          {loading &&
            Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-full w-72 shrink-0 rounded-md" />)}

          {board?.columns.map((column) => (
            <TodoColumn
              key={column.id}
              column={column}
              cards={visibleCards.filter((card) => card.columnId === column.id)}
              onEdit={() => setEditColumn(column)}
              onAddCard={() => setOpenCard({ columnId: column.id })}
              onOpenCard={setOpenCard}
              onMoveCard={moveCard}
            />
          ))}

          {board && board.columns.length === 0 && (
            <p className="w-full p-8 text-center text-sm text-gray-400">No columns yet. Click Add Column to start.</p>
          )}
        </div>
      </section>

      {editColumn !== undefined && (
        <ColumnModal
          column={editColumn}
          cardCount={editColumn ? cardsOf(editColumn.id).length : 0}
          onSave={(title) => (editColumn ? renameColumn(editColumn.id, title) : addColumn(title))}
          onDelete={() => removeColumn(editColumn.id)}
          onClose={() => setEditColumn(undefined)}
        />
      )}

      {openCard && (
        <CardModal
          key={openCard.id ?? 'new'}
          card={openCard}
          columns={board.columns}
          onSave={saveCard}
          onDelete={removeCard}
          onClose={() => setOpenCard(null)}
        />
      )}
    </div>
  )
}

export default TodoPage
