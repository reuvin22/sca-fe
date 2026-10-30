import { useEffect, useState } from 'react'

// Runs the request on mount. Pass a stable function (e.g. a service export).
// Call `reload()` to run it again (e.g. after saving a change).
function useFetch(request) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let ignore = false
    request()
      .then((result) => !ignore && setData(result))
      .catch((err) => !ignore && setError(err.message || 'Something went wrong.'))
      .finally(() => !ignore && setLoading(false))
    return () => {
      ignore = true
    }
  }, [request, version])

  return { data, loading, error, reload: () => setVersion((v) => v + 1) }
}

export default useFetch
