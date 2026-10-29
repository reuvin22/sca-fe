import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

// List + create/update/delete state for a service.
// `service` must be defined outside the component: { getAll, create, update, remove }.
// `label` (e.g. 'Case') shows success toasts like "Case added". Leave it out for no toasts.
function useCrud(service, label) {
  const notify = (action) => label && toast.success(`${label} ${action}`)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    service
      .getAll()
      .then(setItems)
      .catch(() => setError('Could not load data. Please try again.'))
      .finally(() => setLoading(false))
  }, [service])

  // Creates when there is no id, otherwise updates
  const saveItem = async (data) => {
    if (data.id) {
      const updated = await service.update(data)
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      notify('updated')
    } else {
      const created = await service.create(data)
      setItems((prev) => [created, ...prev])
      notify('added')
    }
  }

  const removeItem = async (id) => {
    await service.remove(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
    notify('deleted')
  }

  return { items, loading, error, saveItem, removeItem }
}

export default useCrud
