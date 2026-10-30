import { APPOINTMENTS_ROUTE } from '../api/routes'
import { createListService } from '../utils/apiHelpers'

// { list, listAll, get, create, update, remove }
export const appointmentService = createListService(APPOINTMENTS_ROUTE)
