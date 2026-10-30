import SearchSelect from '../ui/SearchSelect'
import useCategoryOptions from '../../hooks/useCategoryOptions'

// Compact, searchable filter with options from the matching Settings category.
// The field label is the placeholder, so no label is needed above it. Filters never add new options.
function CategoryFilter({ field, value, onChange }) {
  const options = useCategoryOptions(field.category ?? field.label) ?? []

  return (
    <div className="w-full sm:w-48" title={field.label}>
      <SearchSelect
        id={field.id}
        ariaLabel={field.label}
        placeholder={field.label}
        emptyLabel={`Any ${field.label}`}
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default CategoryFilter
