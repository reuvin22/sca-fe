import api from '../api/axios'
import { FEATURES_ROUTE } from '../api/routes'
import { fetchPage } from '../utils/apiHelpers'

// Feature requests with one review status, most votes first. Used by usePaginatedList.
// filters: { status: 'approved' | 'under-review' | 'rejected', search }
export const featureListService = {
  tags: ['features'],
  list: (filters, page) => fetchPage(FEATURES_ROUTE, filters, page),
}

// The signed-in user's own requests (every status), most votes first
export const myFeatureService = {
  tags: ['features'],
  list: (filters, page) => fetchPage(`${FEATURES_ROUTE}/mine`, filters, page),
}

// Votes, or takes the vote back when already voted. Returns { id, votes, voted }.
export async function toggleFeatureVote(id) {
  return (await api.post(`${FEATURES_ROUTE}/${id}/vote`)).data
}
