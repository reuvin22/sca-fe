import { useState } from 'react'
import { Plus } from 'lucide-react'
import Input from './Input'
import Button from './Button'

// Free-typing input with an Add button. Blocks empty and duplicate values.
function AddInput({ id, items, onAdd, placeholder }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = value.trim()
    if (!text) return
    if (items.some((item) => item.toLowerCase() === text.toLowerCase())) {
      return setError(`"${text}" already exists.`)
    }
    onAdd(text)
    setValue('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2">
      <div className="flex-1">
        <Input
          id={id}
          aria-label={placeholder}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={error}
        />
      </div>
      <Button type="submit" fullWidth={false}>
        <Plus size={16} />
        Add
      </Button>
    </form>
  )
}

export default AddInput
