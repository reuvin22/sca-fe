import { ACTIVITY_ROUTE } from '../api/routes'
import { fetchAllPages, fetchPage } from '../utils/apiHelpers'

// The signed-in user's own activity log (read only), newest first: [{ id, action, entity, entityId, createdAt }].
// Used by usePaginatedList.
export const activityService = {
  list: (filters, page) => fetchPage(ACTIVITY_ROUTE, filters, page),
  listAll: (filters) => fetchAllPages(ACTIVITY_ROUTE, filters),
}
