import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Input from '../ui/Input'
import useSavedHeaderFields from '../../hooks/useSavedHeaderFields'

const same = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()
const optionClass = 'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50'

// Label box of a header field with a dropdown of the list (system variables + fields saved before).
// Typing a name that isn't in the list shows "+ Add to the list"; saved fields can be removed with ×.
// `onPickVariable(variable)` turns the field into that variable; `onChange(label)` sets plain text.
function HeaderLabelInput({ id, value, error, onChange, onPickVariable }) {
  const list = useSavedHeaderFields()
  const [open, setOpen] = useState(false)
  const text = value.trim()
  const matches = (label) => !text || label.toLowerCase().includes(text.toLowerCase())
  const variables = list.variables.filter((item) => matches(item.label))
  const savedMatches = list.fields.filter(matches)
  const inList = list.variables.some((item) => same(item.label, text)) || list.fields.some((field) => same(field, text))
  const showAdd = text && !inList

  // Keeps focus in the input so the click isn't lost when the box blurs
  const keepFocus = (e) => e.preventDefault()
  const removeButton = (label, onRemove) => (
    <button
      type="button"
      onMouseDown={keepFocus}
      onClick={onRemove}
      className="mr-2 cursor-pointer rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
      aria-label={`Remove ${label} from the list`}
      title="Remove from the list"
    >
      <X size={14} />
    </button>
  )
  const pick = (action) => {
    action()
    setOpen(false)
  }

  return (
    <div className="relative">
      <Input
        id={id}
        aria-label="Header field label"
        placeholder="e.g. Teacher"
        autoComplete="off"
        value={value}
        error={error}
        maxLength={100}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
      />

      {open && (variables.length > 0 || savedMatches.length > 0 || showAdd) && (
        <ul className="absolute right-0 left-0 z-30 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-100 bg-surface py-1 shadow-lg">
          {variables.map((item) => (
            <li key={item.variable} className="flex items-center">
              <button
                type="button"
                onMouseDown={keepFocus}
                onClick={() => pick(() => onPickVariable(item.variable))}
                className={`${optionClass} text-gray-700`}
              >
                {item.label}
                <span className="ml-auto text-xs text-gray-400">Variable</span>
              </button>
              {removeButton(item.label, () => list.hideVariable(item.label))}
            </li>
          ))}
          {savedMatches.map((label) => (
            <li key={label} className="flex items-center">
              <button
                type="button"
                onMouseDown={keepFocus}
                onClick={() => pick(() => onChange(label))}
                className={`${optionClass} text-gray-700`}
              >
                {label}
              </button>
              {removeButton(label, () => list.remove(label))}
            </li>
          ))}
          {showAdd && (
            <li className="border-t border-gray-100">
              <button
                type="button"
                onMouseDown={keepFocus}
                onClick={() => pick(() => list.add(text))}
                className={`${optionClass} font-medium text-brand-700`}
              >
                <Plus size={14} />
                Add &quot;{text}&quot; to the list
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default HeaderLabelInput
