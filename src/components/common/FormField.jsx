import Input from '../ui/Input'
import SearchSelect from '../ui/SearchSelect'
import useCategoryOptions from '../../hooks/useCategoryOptions'
import useAddSettingsOption from '../../hooks/useAddSettingsOption'
import { isDefaultSettingsCategory } from '../../utils/settingsHelpers'

// Searchable dropdown with Settings options when a category matches `category` (defaults to `label`),
// otherwise a text Input. A typed value that isn't in Settings can be added to it.
function FormField({ label, category = label, value, type, ...props }) {
  const options = useCategoryOptions(category)
  const addOption = useAddSettingsOption()

  if (!options && !isDefaultSettingsCategory(category)) return <Input label={label} type={type} value={value} {...props} />

  return (
    <SearchSelect
      label={label}
      value={value}
      options={options ?? []}
      placeholder={`Search or add ${category}`}
      emptyLabel={value ? 'Clear selection' : undefined}
      onCreate={(text) => addOption(category, text)}
      {...props}
    />
  )
}

export default FormField
