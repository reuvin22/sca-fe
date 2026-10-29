import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import TagInput from '../ui/TagInput'
import { addOption, removeCategory, removeOption } from '../../store/optionsSlice'

function CategoryCard({ category }) {
  const dispatch = useDispatch()
  const { id, name, options } = category

  const handleDelete = () => {
    if (!window.confirm(`Delete "${name}" and all its options?`)) return
    dispatch(removeCategory(id))
    toast.success(`${name} category deleted`)
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
        onAdd={(option) => {
          dispatch(addOption({ categoryId: id, option }))
          toast.success(`${option} added to ${name}`)
        }}
        onRemove={(option) => {
          dispatch(removeOption({ categoryId: id, option }))
          toast.success(`${option} removed from ${name}`)
        }}
      />
    </Card>
  )
}

export default CategoryCard
