import { useState } from 'react'

// Tracks loading and error state for an async call. Returns null on failure.
function useRequest(request) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async (...args) => {
    setLoading(true)
    setError('')
    try {
      return (await request(...args)) ?? true
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { run, loading, error }
}

export default useRequest
