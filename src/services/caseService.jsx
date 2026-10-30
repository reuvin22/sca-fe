import { CASES_ROUTE } from '../api/routes'
import { createListService } from '../utils/apiHelpers'

// { list, listAll, get, create, update, remove }
export const caseService = createListService(CASES_ROUTE)
