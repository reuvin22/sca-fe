import api from '../api/axios'
import { CASES_ROUTE } from '../api/routes'
import { createListService } from '../utils/apiHelpers'

// { list, listAll, get, create, update, remove }
export const caseService = createListService(CASES_ROUTE)

// Action history of one case, newest first: [{ id, createdAt, action, status, changes: [{ label, from?, to? }] }]
export async function getCaseHistory(id) {
  return (await api.get(`${CASES_ROUTE}/${id}/history`)).data
}
