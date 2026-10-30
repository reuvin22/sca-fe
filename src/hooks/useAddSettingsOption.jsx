import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createCategory, updateOptions } from '../services/categoryService'
import { addCategory, updateCategory } from '../store/optionsSlice'
import { normalizeName } from '../utils/settingsHelpers'

// Saves a value the user typed into Settings, so it shows in the dropdown next time.
// Adds it to the matching category, or creates the category first when it doesn't exist.
// Returns true when saved. New options go first (newest first).
function useAddSettingsOption() {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.options.categories)

  return async (categoryName, option) => {
    try {
      let category = categories.find((item) => normalizeName(item.name) === normalizeName(categoryName))
      if (!category) {
        category = await createCategory(categoryName)
        dispatch(addCategory(category))
      }
      const saved = await updateOptions(category.id, [option, ...category.options])
      dispatch(updateCategory(saved))
      toast.success(`"${option}" added to ${saved.name} in Settings`)
      return true
    } catch (error) {
      toast.error(error.message)
      return false
    }
  }
}

export default useAddSettingsOption
