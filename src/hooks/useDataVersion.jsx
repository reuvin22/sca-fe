import { useCallback, useSyncExternalStore } from 'react'
import { dataVersion, subscribeToDataSync } from '../utils/dataSync'

const noSubscription = () => () => {}

// A value that changes when data with any of these tags changed, or everything refreshed (see utils/dataSync).
// Put it in an effect's dependencies to reload quietly, e.g. useDataVersion(['cases']).
// Without tags it never changes (one-time loads, e.g. checking an invitation link).
function useDataVersion(tags) {
  const key = tags ? tags.join(',') : null
  const read = useCallback(() => (key === null ? '' : dataVersion(key ? key.split(',') : [])), [key])
  return useSyncExternalStore(key === null ? noSubscription : subscribeToDataSync, read)
}

export default useDataVersion
