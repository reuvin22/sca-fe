import { useId, useState } from 'react'
import { ChevronDown, LoaderCircle, Plus } from 'lucide-react'
import { FIELD_TEXT, FIELD_TEXT_PLACEHOLDER, fieldClass } from '../../utils/styles'

// Dropdown you can type in to search. `options`: list of strings.
// `onChange` gets an input-like event ({ target: { name, value } }) so it works with useForm.
// `emptyLabel`: first choice that clears the value (e.g. "Any Sex" in filters).
// `onCreate(text)`: when given, a typed value that isn't in the list can be added. Return true when saved.
// `freeText`: the typed text is the value (options are only suggestions), e.g. a student name.
function SearchSelect({
  label,
  ariaLabel,
  id,
  value,
  options,
  onChange,
  onCreate,
  emptyLabel,
  placeholder,
  error,
  disabled,
  freeText = false,
}) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  // Free text starts with nothing highlighted, so Enter keeps what was typed
  const [active, setActive] = useState(freeText ? -1 : 0)
  const [creating, setCreating] = useState(false)

  const text = (freeText ? value : query).trim()
  const exists = options.some((option) => option.toLowerCase() === text.toLowerCase())
  // What the list shows: { value, label, create? }
  const choices = [
    ...(emptyLabel && !text ? [{ value: '', label: emptyLabel }] : []),
    ...options.filter((option) => option.toLowerCase().includes(text.toLowerCase())).map((option) => ({ value: option, label: option })),
    ...(onCreate && text && !exists ? [{ value: text, label: `Add "${text}"`, create: true }] : []),
  ]

  const close = () => {
    setOpen(false)
    setQuery('')
  }

  const choose = async (choice) => {
    if (choice.create) {
      setCreating(true)
      const saved = await onCreate(choice.value)
      setCreating(false)
      if (!saved) return
    }
    onChange({ target: { name: id, value: choice.value } })
    close()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) return setOpen(true)
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (Math.max(i, -1) + step + choices.length) % Math.max(choices.length, 1))
    } else if (e.key === 'Enter' && open && choices[active]) {
      e.preventDefault() // picks the option instead of submitting the form
      choose(choices[active])
    } else if (e.key === 'Escape') {
      close()
    }
  }

  const handleType = (e) => {
    if (freeText) onChange({ target: { name: id, value: e.target.value } })
    else setQuery(e.target.value)
    setActive(freeText ? -1 : 0)
    setOpen(true)
  }

  // Free text with no matching suggestions: nothing to show
  const showList = open && !(freeText && choices.length === 0)
  const showValueAsPlaceholder = !freeText && open && Boolean(value)

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={id}
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          // While open the box is for searching; the current value shows as the placeholder,
          // in the same black/white as normal text so it stays readable
          className={`pr-9 ${fieldClass(error)} ${showValueAsPlaceholder ? FIELD_TEXT_PLACEHOLDER : ''}`}
          value={freeText || !open ? value : query}
          placeholder={showValueAsPlaceholder ? value : placeholder}
          disabled={disabled || creating}
          onFocus={() => {
            setOpen(true)
            setActive(freeText ? -1 : 0)
          }}
          onBlur={close}
          onChange={handleType}
          onKeyDown={handleKeyDown}
        />
        {creating ? (
          <LoaderCircle size={16} className="absolute top-1/2 right-3 -translate-y-1/2 animate-spin text-gray-400" />
        ) : (
          <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
        )}

        {showList && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-30 mt-1 max-h-60 w-full min-w-48 overflow-y-auto rounded-lg border border-gray-200 bg-surface py-1 shadow-lg"
          >
            {choices.length === 0 && <li className="px-3 py-2 text-sm text-gray-400">No matches</li>}
            {choices.map((choice, i) => {
              const selected = !choice.create && choice.value === value
              return (
                <li
                  key={choice.create ? 'create' : `option-${choice.value}`}
                  role="option"
                  aria-selected={selected}
                  // Keeps focus in the input so it doesn't close before the click
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(choice)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${FIELD_TEXT} ${i === active ? 'bg-gray-100' : ''} ${choice.create || selected ? 'font-semibold' : ''}`}
                >
                  {choice.create && <Plus size={14} />}
                  {choice.label}
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default SearchSelect
