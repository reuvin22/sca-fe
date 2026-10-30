import api from '../api/axios'
import { TODO_BOARD_ROUTE } from '../api/routes'

// Board: { columns: [{ id, title }], cards: [...] }
export async function getBoard() {
  return (await api.get(TODO_BOARD_ROUTE)).data
}

// Saves the whole board (columns and cards)
export async function saveBoard(board) {
  return (await api.put(TODO_BOARD_ROUTE, board)).data
}
