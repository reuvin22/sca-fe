import { X } from 'lucide-react'
import AddInput from './AddInput'

// AddInput plus a removable list of chips.
function TagInput({ id, items, onAdd, onRemove, placeholder }) {
  return (
    <div className="space-y-3">
      <AddInput id={id} items={items} onAdd={onAdd} placeholder={placeholder} />

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No options yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1 rounded-full bg-purple-50 py-1 pr-1 pl-3 text-sm text-purple-700"
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                className="cursor-pointer rounded-full p-0.5 hover:bg-purple-100"
                aria-label={`Remove ${item}`}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TagInput
