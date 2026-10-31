import { useEffect, useState } from 'react'
import useDataVersion from './useDataVersion'

// Runs the request on mount. Pass a stable function (e.g. a service export).
// Call `reload()` to run it again (e.g. after saving a change).
// `tags` (optional): reload quietly when that data changes (utils/dataSync), when the user comes back to
// the tab, after reconnecting and every 30 seconds while visible. Without tags it loads once.
function useFetch(request, tags) {
  const synced = useDataVersion(tags)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let ignore = false
    request()
      .then((result) => {
        if (ignore) return
        setData(result)
        setError('')
      })
      .catch((err) => !ignore && setError(err.message || 'Something went wrong.'))
      .finally(() => !ignore && setLoading(false))
    return () => {
      ignore = true
    }
  }, [request, version, synced])

  return { data, loading, error, reload: () => setVersion((v) => v + 1) }
}

export default useFetch
