import { useDispatch, useSelector } from 'react-redux'
import Card from '../ui/Card'
import AddInput from '../ui/AddInput'
import CategoryCard from './CategoryCard'
import { addCategory } from '../../store/optionsSlice'

function CustomOptions() {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.options.categories)

  return (
    <div className="space-y-6">
      <Card title="Add Category">
        <AddInput
          id="category"
          items={categories.map((category) => category.name)}
          placeholder="e.g. Grade & Section"
          onAdd={(name) => dispatch(addCategory(name))}
        />
      </Card>

      {categories.length === 0 ? (
        <p className="text-center text-sm text-gray-400">No categories yet. Add one above.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomOptions
