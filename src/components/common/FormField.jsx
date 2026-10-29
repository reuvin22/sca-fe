import Input from '../ui/Input'
import Select from '../ui/Select'
import useCategoryOptions from '../../hooks/useCategoryOptions'

// Select with Settings options when a category matches `category` (defaults to `label`), otherwise a text Input.
function FormField({ label, category = label, value, ...props }) {
  const options = useCategoryOptions(category)

  if (!options) return <Input label={label} value={value} {...props} />

  // Keep an old value that is no longer in Settings so it isn't lost
  const list = value && !options.includes(value) ? [value, ...options] : options

  return (
    <Select
      label={label}
      value={value}
      options={[{ value: '', label: `Select ${label}` }, ...list.map((option) => ({ value: option, label: option }))]}
      {...props}
    />
  )
}

export default FormField
