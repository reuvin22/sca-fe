import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createCategory, updateOptions } from '../services/categoryService'
import { addCategory, updateCategory } from '../store/optionsSlice'
import { VARIABLES } from '../utils/formBuilderHelpers'
import { normalizeName } from '../utils/settingsHelpers'

// The header field list, kept in Settings so it follows the account:
// - "Form Header Fields": names the user added (e.g. "Teacher")
// - "Hidden Form Header Fields": system variables the user removed from the list (by label)
export const HEADER_FIELDS_CATEGORY = 'Form Header Fields'
export const HIDDEN_FIELDS_CATEGORY = 'Hidden Form Header Fields'

function useSavedHeaderFields() {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.options.categories)
  const find = (name) => categories.find((item) => normalizeName(item.name) === normalizeName(name))
  const fields = find(HEADER_FIELDS_CATEGORY)?.options ?? []
  const hidden = find(HIDDEN_FIELDS_CATEGORY)?.options ?? []
  const variables = VARIABLES.filter((item) => !hidden.includes(item.label))

  // Saves a category's whole list (creates the category the first time). Returns true when saved.
  const save = async (name, options) => {
    try {
      let target = find(name)
      if (!target) {
        target = await createCategory(name)
        dispatch(addCategory(target))
      }
      dispatch(updateCategory(await updateOptions(target.id, options)))
      return true
    } catch (error) {
      toast.error(error.message)
      return false
    }
  }

  return {
    fields, // saved names
    variables, // system variables still in the list
    hiddenCount: VARIABLES.length - variables.length,
    // A removed system variable comes back; any other name is saved as a new field
    add: (label) => {
      const variable = VARIABLES.find((item) => normalizeName(item.label) === normalizeName(label))
      if (variable)
        return save(
          HIDDEN_FIELDS_CATEGORY,
          hidden.filter((item) => item !== variable.label),
        )
      return save(HEADER_FIELDS_CATEGORY, [...fields, label])
    },
    remove: (label) =>
      save(
        HEADER_FIELDS_CATEGORY,
        fields.filter((field) => field !== label),
      ),
    hideVariable: (label) => save(HIDDEN_FIELDS_CATEGORY, [...hidden, label]),
    restoreVariables: () => save(HIDDEN_FIELDS_CATEGORY, []),
  }
}

export default useSavedHeaderFields
