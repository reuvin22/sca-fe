import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useDebounce from './useDebounce'

// A backend list with filters, pages (max 15 per page) and create/update/delete.
// `service` must be defined outside the component: { list, listAll, create, update?, remove }.
// `label` (e.g. 'Case') shows success toasts like "Case added". Leave it out for no toasts.
// `all: true` loads every matching row instead of one page (e.g. the calendar view).
//
// No re-render flashes: the skeleton (`loading`) shows only on the first load (or when switching
// between page and `all` mode). Later reloads keep the current rows on screen (`refreshing`),
// and create/update/delete change the rows right away, then reload quietly in the background.
function usePaginatedList(service, label, filters, { all = false } = {}) {
  // `key` says which request this result belongs to; `all` which mode it was loaded in
  const [result, setResult] = useState({ key: '', all, items: [], pagination: null, error: '' })
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

  const requestKey = `${filterKey}|${page}|${all}|${version}`
  const loading = !result.key || result.all !== all // nothing to show yet: skeleton
  const refreshing = !loading && result.key !== requestKey // showing the last rows while new ones load

  useEffect(() => {
    let ignore = false
    const request = all
      ? service.listAll(JSON.parse(filterKey)).then((rows) => ({ items: rows, pagination: null }))
      : service.list(JSON.parse(filterKey), page)

    request
      .then((data) => !ignore && setResult({ key: requestKey, all, ...data, error: '' }))
      .catch(() => {
        if (!ignore) setResult((prev) => ({ ...prev, key: requestKey, all, error: 'Could not load data. Please try again.' }))
      })
    return () => {
      ignore = true
    }
  }, [service, filterKey, page, all, requestKey])

  const reload = () => setVersion((v) => v + 1)
  const notify = (action) => label && toast.success(`${label} ${action}`)
  const updateItems = (change) => setResult((prev) => ({ ...prev, items: change(prev.items) }))

  // Creates when there is no id, otherwise updates. Throws on failure so modals can show the error.
  // The table changes right away; the quiet reload then brings in counts and ordering from the server.
  const saveItem = async (data) => {
    const saved = data.id ? await service.update(data) : await service.create(data)
    notify(data.id ? 'updated' : 'added')
    if (data.id) {
      updateItems((items) => items.map((item) => (item.id === saved.id ? saved : item)))
    } else if (page === 1 || all) {
      updateItems((items) => [saved, ...items]) // new items are listed first
    } else {
      setPage(1) // go to page 1 to show the new item
    }
    reload()
    return saved
  }

  const removeItem = async (id) => {
    await service.remove(id)
    notify('deleted')
    updateItems((items) => items.filter((item) => item.id !== id))
    // The last row of a page was deleted: go back one page
    if (result.items.length === 1 && page > 1) setPage(page - 1)
    else reload()
  }

  const { items, pagination, error } = result
  return { items, pagination, page, setPage, loading, refreshing, error, saveItem, removeItem, reload }
}

export default usePaginatedList
