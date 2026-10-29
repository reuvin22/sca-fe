import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp, Equal } from 'lucide-react'
import { generateTaskId } from './idHelpers'

// Board shape: { columns: [{ id, title }], cards: [{ id, key, columnId, title, description, dueDate, priority }] }
// Card order inside a column is the order in the `cards` array.
// Each helper returns a new board (state is never changed directly).

// Same priority levels as Jira
export const PRIORITIES = {
  highest: { label: 'Highest', icon: ChevronsUp, className: 'text-red-600' },
  high: { label: 'High', icon: ChevronUp, className: 'text-red-500' },
  medium: { label: 'Medium', icon: Equal, className: 'text-amber-500' },
  low: { label: 'Low', icon: ChevronDown, className: 'text-sky-500' },
  lowest: { label: 'Lowest', icon: ChevronsDown, className: 'text-sky-600' },
}

export const PRIORITY_OPTIONS = Object.entries(PRIORITIES).map(([value, { label }]) => ({ value, label }))

export const emptyCard = { title: '', description: '', dueDate: '', priority: 'medium' }

// Cards whose title or key matches the search
export function filterCards(cards, search) {
  const keyword = search.trim().toLowerCase()
  return cards.filter((card) => `${card.title} ${card.key}`.toLowerCase().includes(keyword))
}

export const addColumn = (board, title) => ({
  ...board,
  columns: [...board.columns, { id: crypto.randomUUID(), title }],
})

export const renameColumn = (board, id, title) => ({
  ...board,
  columns: board.columns.map((column) => (column.id === id ? { ...column, title } : column)),
})

// Also removes the column's cards
export const removeColumn = (board, id) => ({
  columns: board.columns.filter((column) => column.id !== id),
  cards: board.cards.filter((card) => card.columnId !== id),
})

// Creates when the card has no id, otherwise updates
export const saveCard = (board, card) => ({
  ...board,
  cards: card.id
    ? board.cards.map((item) => (item.id === card.id ? card : item))
    : [...board.cards, { ...card, id: crypto.randomUUID(), key: generateTaskId() }],
})

export const removeCard = (board, id) => ({ ...board, cards: board.cards.filter((card) => card.id !== id) })

// Moves a card to a column, before `beforeId` (or to the end when there is none)
export function moveCard(board, cardId, columnId, beforeId) {
  const card = board.cards.find((item) => item.id === cardId)
  if (!card || cardId === beforeId) return board

  const cards = board.cards.filter((item) => item.id !== cardId)
  const moved = { ...card, columnId }
  const index = cards.findIndex((item) => item.id === beforeId)
  if (index === -1) cards.push(moved)
  else cards.splice(index, 0, moved)
  return { ...board, cards }
}
