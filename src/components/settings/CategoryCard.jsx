import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import TagInput from '../ui/TagInput'
import { deleteCategory, updateOptions } from '../../services/categoryService'
import { removeCategory, updateCategory } from '../../store/optionsSlice'

// Shows a toast for the result of a save
const withToast = (request, message) =>
  request.then(() => toast.success(message)).catch((error) => toast.error(error.message))

function CategoryCard({ category }) {
  const dispatch = useDispatch()
  const { id, name, options } = category

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

  return (
    <Card
      title={name}
      action={
        <button
          onClick={handleDelete}
          className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
          aria-label={`Delete ${name}`}
        >
          <Trash2 size={16} />
        </button>
      }
    >
      <TagInput
        id={`option-${id}`}
        items={options}
        placeholder={`Add ${name} option`}
        onAdd={(option) => saveOptions([...options, option], `${option} added to ${name}`)}
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
