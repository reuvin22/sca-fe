import { useEffect, useState } from 'react'
import { createCase, deleteCase, getCases, updateCase } from '../services/caseService'

function useCases() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCases()
      .then(setCases)
      .finally(() => setLoading(false))
  }, [])

  // Creates when there is no id, otherwise updates
  const saveCase = async (data) => {
    if (data.id) {
      const updated = await updateCase(data)
      setCases((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    } else {
      const created = await createCase(data)
      setCases((prev) => [created, ...prev])
    }
  }

  const removeCase = async (id) => {
    await deleteCase(id)
    setCases((prev) => prev.filter((item) => item.id !== id))
  }

  return { cases, loading, saveCase, removeCase }
}

export default useCases
