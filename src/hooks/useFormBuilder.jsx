import { useEffect, useState } from 'react'
import { discardFormChanges, formService, saveFormDraft } from '../services/formService'
import { emptyFormBuilder, newQuestion } from '../utils/formBuilderHelpers'

// The parts of a form that are saved (no id, dates or flags)
const contentOf = ({ title, description, header, questions }) => ({ title, description, header, questions })
const fingerprint = (form) => JSON.stringify(contentOf(form))

// State of the Create / Edit Form page. `id` is undefined when creating; `imported` (optional)
// is a form read from a file to start from instead of the empty one.
// Items live in two lists: `header` (student details, not numbered) and `questions` (numbered).
// Every item function takes the list name first: addItem('header', preset).
// `dirty`: changes not saved yet (kept as a draft when leaving, see saveDraft).
function useFormBuilder(id, imported) {
  const [start] = useState(() => (id ? null : (imported ?? emptyFormBuilder())))
  const [form, setForm] = useState(start)
  // What counts as "nothing changed": an imported form is unsaved work from the start
  const [baseline, setBaseline] = useState(() => (start && !imported ? fingerprint(start) : ''))
  const [draftId, setDraftId] = useState(null) // a new form kept as a draft gets an id
  const [saved, setSaved] = useState(null) // the saved version, to discard unsaved changes
  const [loadError, setLoadError] = useState('')
  const formId = id ?? draftId

  // Opens the unsaved changes from last time, if any (the saved version stays live until Save)
  useEffect(() => {
    if (!id) return
    let ignore = false
    formService
      .get(id)
      .then((loaded) => {
        if (ignore) return
        const open = loaded.pendingChanges ? { ...loaded, ...loaded.pendingChanges } : loaded
        setForm(open)
        setSaved(loaded)
        setBaseline(fingerprint(open))
      })
      .catch((err) => !ignore && setLoadError(err.message))
    return () => {
      ignore = true
    }
  }, [id])

  const dirty = Boolean(form) && fingerprint(form) !== baseline

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

  // Saves (and publishes a draft or unsaved changes)
  const save = async () => {
    const data = contentOf(form)
    const result = formId ? await formService.update({ id: formId, ...data }) : await formService.create(data)
    setBaseline(fingerprint(form))
    return result
  }

  // Keeps unfinished work when leaving without saving
  const saveDraft = async () => {
    const result = await saveFormDraft(formId, contentOf(form))
    setDraftId(result.id)
    setBaseline(fingerprint(form))
    return result
  }

  // Goes back to the saved version and drops the unsaved changes kept from last time
  const discardChanges = async () => {
    await discardFormChanges(formId)
    setForm(saved)
    setBaseline(fingerprint(saved))
    setSaved({ ...saved, pendingChanges: null })
  }

  return {
    form,
    dirty,
    isDraft: Boolean(saved?.draft),
    hasPendingChanges: Boolean(saved?.pendingChanges),
    loadError,
    replaceForm,
    setField,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    save,
    saveDraft,
    discardChanges,
  }
}

export default useFormBuilder
