// Mock API with static data. Replace with real axios calls when the backend is ready.
import { toDateString } from '../utils/dateHelpers'
import { generateTaskId } from '../utils/idHelpers'
import { delay } from '../utils/mockApi'
import { emptyCard } from '../utils/todoHelpers'

const sampleCards = [
  { columnId: 'todo', title: 'Prepare parent conference notes', priority: 'high', dueDate: toDateString(2) },
  { columnId: 'todo', title: 'Update intake logbook', priority: 'medium' },
  { columnId: 'todo', title: 'Schedule group counseling for Grade 5', priority: 'low' },
  { columnId: 'in-progress', title: 'Review referral forms', description: 'Check signatures.', priority: 'highest', dueDate: toDateString(1) },
  { columnId: 'in-progress', title: 'Follow up on home visitation report', priority: 'medium' },
  { columnId: 'done', title: 'Send weekly report', priority: 'lowest', dueDate: toDateString(-1) },
]

// Kept in memory so changes stay until refresh
let board = {
  columns: [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ],
  cards: sampleCards.map((card) => ({ ...emptyCard, ...card, id: crypto.randomUUID(), key: generateTaskId() })),
}

export async function getBoard() {
  await delay()
  return board
}

// Saves the whole board (columns and cards)
export async function saveBoard(next) {
  await delay(300)
  board = next
  return board
}
