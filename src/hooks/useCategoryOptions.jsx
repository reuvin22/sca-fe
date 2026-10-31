import { useSelector } from 'react-redux'
import { normalizeName } from '../utils/settingsHelpers'

// Options of the Settings category with the same name, or undefined if none.
function useCategoryOptions(name) {
  return useSelector(
    (state) =>
      state.options.categories.find((category) => normalizeName(category.name) === normalizeName(name))?.options,
  )
}

export default useCategoryOptions
