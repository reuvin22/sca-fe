import Select from '../ui/Select'
import useCategoryOptions from '../../hooks/useCategoryOptions'

// Compact filter dropdown with options from the matching Settings category.
// The field label is the first option, so no label is needed above it.
function CategoryFilter({ field, value, onChange }) {
  const options = useCategoryOptions(field.category ?? field.label) ?? []

  return (
    <div title={field.label}>
      <Select
        id={field.id}
        aria-label={field.label}
        options={[{ value: '', label: field.label }, ...options.map((option) => ({ value: option, label: option }))]}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default CategoryFilter
