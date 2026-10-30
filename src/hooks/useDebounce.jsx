import { useEffect, useState } from 'react'

// Returns `value` after it stops changing for `delay` ms (e.g. wait until the user stops typing)
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export default useDebounce
