import { Plus, RotateCcw, X } from 'lucide-react'
import useSavedHeaderFields from '../../hooks/useSavedHeaderFields'

const chip =
  'flex cursor-pointer items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'

const same = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

// One list item: "+ Label" adds it to the form, × removes it from the list
function ListChip({ label, disabled, onAdd, onRemove }) {
  return (
    <span className="flex items-center rounded-full border border-gray-200 text-sm text-gray-700">
      <button
        type="button"
        disabled={disabled}
        onClick={onAdd}
        className="flex cursor-pointer items-center gap-1 rounded-l-full py-1 pl-3 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={14} />
        {label}
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 cursor-pointer rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
        aria-label={`Remove ${label} from the list`}
        title="Remove from the list"
      >
        <X size={14} />
      </button>
    </span>
  )
}

// One-click header fields: system variables and fields saved before. × removes any of them from the
// list (system variables can be restored). "Custom field" adds an empty one; new names are added to
// the list from the field's own label dropdown (see HeaderLabelInput). `header` is the form's header.
function HeaderFieldPicker({ header, onAddVariable, onAddCustom }) {
  const list = useSavedHeaderFields()
  const full = header.length >= 30

  return (
    <div className="flex flex-wrap gap-2">
      {list.variables.map(({ variable, label }) => (
        <ListChip
          key={variable}
          label={label}
          disabled={full || header.some((field) => field.variable === variable)}
          onAdd={() => onAddVariable(variable)}
          onRemove={() => list.hideVariable(label)}
        />
      ))}
      {list.fields.map((label) => (
        <ListChip
          key={label}
          label={label}
          disabled={full || header.some((field) => same(field.label, label))}
          onAdd={() => onAddCustom(label)}
          onRemove={() => list.remove(label)}
        />
      ))}
      <button type="button" disabled={full} onClick={() => onAddCustom('')} className={chip}>
        <Plus size={14} />
        Custom field
      </button>
      {list.hiddenCount > 0 && (
        <button type="button" onClick={list.restoreVariables} className={`${chip} text-gray-500`}>
          <RotateCcw size={14} />
          Restore removed ({list.hiddenCount})
        </button>
      )}
    </div>
  )
}

export default HeaderFieldPicker
