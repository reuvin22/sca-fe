import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useDebounce from './useDebounce'

// A backend list with filters, pages (max 15 per page) and create/update/delete.
// `service` must be defined outside the component: { list, listAll, create, update?, remove }.
// `label` (e.g. 'Case') shows success toasts like "Case added". Leave it out for no toasts.
// `all: true` loads every matching row instead of one page (e.g. the calendar view).
function usePaginatedList(service, label, filters, { all = false } = {}) {
  // `key` says which request this result belongs to
  const [result, setResult] = useState({ key: '', items: [], pagination: null, error: '' })
  const [page, setPage] = useState(1)
  const [version, setVersion] = useState(0) // bump to reload
  const debouncedFilters = useDebounce(filters)
  const filterKey = JSON.stringify(debouncedFilters)

  // New filters start again from page 1
  const [lastFilterKey, setLastFilterKey] = useState(filterKey)
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey)
    setPage(1)
  }

  // Loading until the result matches the current filters, page, view and reload
  const requestKey = `${filterKey}|${page}|${all}|${version}`
  const loading = result.key !== requestKey

  useEffect(() => {
    let ignore = false
    const request = all
      ? service.listAll(JSON.parse(filterKey)).then((rows) => ({ items: rows, pagination: null }))
      : service.list(JSON.parse(filterKey), page)

    request
      .then((data) => !ignore && setResult({ key: requestKey, ...data, error: '' }))
      .catch(() => {
        if (!ignore) setResult((prev) => ({ ...prev, key: requestKey, error: 'Could not load data. Please try again.' }))
      })
    return () => {
      ignore = true
    }
  }, [service, filterKey, page, all, requestKey])

  const reload = () => setVersion((v) => v + 1)
  const notify = (action) => label && toast.success(`${label} ${action}`)

  // Creates when there is no id, otherwise updates. Throws on failure so modals can show the error.
  const saveItem = async (data) => {
    const saved = data.id ? await service.update(data) : await service.create(data)
    notify(data.id ? 'updated' : 'added')
    reload()
    return saved
  }

  const removeItem = async (id) => {
    await service.remove(id)
    notify('deleted')
    // The last row of a page was deleted: go back one page
    if (result.items.length === 1 && page > 1) setPage(page - 1)
    else reload()
  }

  const { items, pagination, error } = result
  return { items, pagination, page, setPage, loading, error, saveItem, removeItem, reload }
}

export default usePaginatedList
