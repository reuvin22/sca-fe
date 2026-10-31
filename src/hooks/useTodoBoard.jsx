import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getBoard, saveBoard } from '../services/todoService'
import useDataVersion from './useDataVersion'
import * as todo from '../utils/todoHelpers'

// Toast after saving a card: added, updated, or moved to another column
function cardMessage(board, card) {
  if (!card.id) return 'Card added'
  const old = board.cards.find((item) => item.id === card.id)
  if (old && old.columnId !== card.columnId) {
    return `Card moved to ${board.columns.find((column) => column.id === card.columnId)?.title}`
  }
  return 'Card updated'
}

const TAGS = ['todo']

// Board state for the To Do page. Each action saves the updated board.
function useTodoBoard() {
  const [board, setBoard] = useState(null)
  const [error, setError] = useState('')
  // Reloads when the board changed in another tab and on refresh (utils/dataSync)
  const synced = useDataVersion(TAGS)

  useEffect(() => {
    let ignore = false
    getBoard()
      .then((loaded) => !ignore && setBoard(loaded))
      .catch(() => !ignore && setError('Could not load the board. Please try again.'))
    return () => {
      ignore = true
    }
  }, [synced])

  // Applies a change, saves it, then shows `message`. Throws on failure so modals can show the error.
  const update = async (change, message) => {
    const next = change(board)
    await saveBoard(next)
    setBoard(next)
    toast.success(message)
  }

  // Drag and drop updates the screen first, then saves
  const moveCard = (cardId, columnId, beforeId) => {
    const next = todo.moveCard(board, cardId, columnId, beforeId)
    setBoard(next)
    saveBoard(next).catch(() => setError('Could not save the card move. Please try again.'))
  }

  return {
    board,
    loading: !board && !error,
    error,
    addColumn: (title) => update((b) => todo.addColumn(b, title), 'Column added'),
    renameColumn: (id, title) => update((b) => todo.renameColumn(b, id, title), 'Column updated'),
    removeColumn: (id) => update((b) => todo.removeColumn(b, id), 'Column deleted'),
    saveCard: (card) => update((b) => todo.saveCard(b, card), cardMessage(board, card)),
    removeCard: (id) => update((b) => todo.removeCard(b, id), 'Card deleted'),
    moveCard,
  }
}

export default useTodoBoard
