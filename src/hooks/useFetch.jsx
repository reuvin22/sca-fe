import { useEffect, useState } from 'react'

// Runs the request on mount. Pass a stable function (e.g. a service export).
function useFetch(request) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    request()
      .then((result) => !ignore && setData(result))
      .catch((err) => !ignore && setError(err.message || 'Something went wrong.'))
      .finally(() => !ignore && setLoading(false))
    return () => {
      ignore = true
    }
  }, [request])

  return { data, loading, error }
}

export default useFetch
