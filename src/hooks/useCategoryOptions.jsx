import { useSelector } from 'react-redux'

const normalize = (text) => text.trim().toLowerCase()

// Options of the Settings category with the same name, or undefined if none.
function useCategoryOptions(name) {
  return useSelector(
    (state) => state.options.categories.find((category) => normalize(category.name) === normalize(name))?.options,
  )
}

export default useCategoryOptions
