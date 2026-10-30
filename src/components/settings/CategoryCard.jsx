import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Pencil, Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import TagInput from '../ui/TagInput'
import useRequest from '../../hooks/useRequest'
import { deleteCategory, renameCategory, updateOptions } from '../../services/categoryService'
import { removeCategory, updateCategory } from '../../store/optionsSlice'

const ICON_BUTTON = 'cursor-pointer rounded-lg p-1.5 text-gray-400'

// Shows a toast for the result of a save
const withToast = (request, message) =>
  request.then(() => toast.success(message)).catch((error) => toast.error(error.message))

function CategoryCard({ category }) {
  const dispatch = useDispatch()
  const { id, name, options } = category
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState(name)
  const rename = useRequest(renameCategory)

  // Saves the new options list, then updates the store with the saved category
  const saveOptions = (next, message) =>
    withToast(
      updateOptions(id, next).then((saved) => dispatch(updateCategory(saved))),
      message,
    )

  const handleDelete = () => {
    if (!window.confirm(`Delete "${name}" and all its options?`)) return
    withToast(
      deleteCategory(id).then(() => dispatch(removeCategory(id))),
      `${name} category deleted`,
    )
  }

  const startEdit = () => {
    setNewName(name)
    setEditing(true)
  }

  const handleRename = async (e) => {
    e.preventDefault()
    const text = newName.trim()
    if (!text || text === name) return setEditing(false)
    const saved = await rename.run(id, text)
    if (!saved) return
    dispatch(updateCategory(saved))
    toast.success(`Category renamed to ${saved.name}`)
    setEditing(false)
  }

  const actions = (
    <div className="flex gap-1">
      <button onClick={startEdit} className={`${ICON_BUTTON} hover:bg-gray-100 hover:text-gray-700`} aria-label={`Edit ${name}`}>
        <Pencil size={16} />
      </button>
      <button onClick={handleDelete} className={`${ICON_BUTTON} hover:bg-red-50 hover:text-red-600`} aria-label={`Delete ${name}`}>
        <Trash2 size={16} />
      </button>
    </div>
  )

  return (
    <Card title={editing ? undefined : name} action={actions}>
      {editing && (
        <form onSubmit={handleRename} className="mb-4 space-y-2">
          <Input
            id={`name-${id}`}
            label="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            error={rename.error}
            autoFocus
          />
          {/* Fields find their dropdown by this name, e.g. "Sex" fills the Sex field */}
          <p className="text-xs text-gray-500">Form fields with the same name use this category's options.</p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" fullWidth={false} onClick={() => setEditing(false)} disabled={rename.loading}>
              Cancel
            </Button>
            <Button type="submit" fullWidth={false} loading={rename.loading}>
              Save
            </Button>
          </div>
        </form>
      )}
      <TagInput
        id={`option-${id}`}
        items={options}
        placeholder={`Add ${name} option`}
        onAdd={(option) => saveOptions([option, ...options], `${option} added to ${name}`)}
        onRemove={(option) =>
          saveOptions(
            options.filter((item) => item !== option),
            `${option} removed from ${name}`,
          )
        }
      />
    </Card>
  )
}

export default CategoryCard
