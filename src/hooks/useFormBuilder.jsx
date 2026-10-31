import { useEffect, useState } from 'react'
import { formService } from '../services/formService'
import { emptyFormBuilder, newQuestion } from '../utils/formBuilderHelpers'

// State of the Create / Edit Form page. `id` is undefined when creating; `imported` (optional)
// is a form read from a file to start from instead of the empty one.
// Items live in two lists: `header` (student details, not numbered) and `questions` (numbered).
// Every item function takes the list name first: addItem('header', preset).
function useFormBuilder(id, imported) {
  const [form, setForm] = useState(id ? null : () => imported ?? emptyFormBuilder())
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!id) return
    let ignore = false
    formService
      .get(id)
      .then((saved) => !ignore && setForm(saved))
      .catch((err) => !ignore && setLoadError(err.message))
    return () => {
      ignore = true
    }
  }, [id])

  // Fills the builder from an imported file (keeps editing the same saved form when editing)
  const replaceForm = (next) => setForm((prev) => ({ ...prev, ...next }))
  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))
  const setList = (list, change) => setForm((prev) => ({ ...prev, [list]: change(prev[list]) }))

  const addItem = (list, item) => setList(list, (items) => [...items, item ?? newQuestion()])
  const updateItem = (list, itemId, changes) =>
    setList(list, (items) => items.map((item) => (item.id === itemId ? { ...item, ...changes } : item)))
  const removeItem = (list, itemId) => setList(list, (items) => items.filter((item) => item.id !== itemId))
  const moveItem = (list, index, offset) =>
    setList(list, (items) => {
      const next = [...items]
      ;[next[index], next[index + offset]] = [next[index + offset], next[index]]
      return next
    })

  // Saves only the fields the backend accepts
  const save = () => {
    const { title, description, header, questions } = form
    const data = { title, description, header, questions }
    return id ? formService.update({ id, ...data }) : formService.create(data)
  }

  return { form, loadError, replaceForm, setField, addItem, updateItem, removeItem, moveItem, save }
}

export default useFormBuilder
