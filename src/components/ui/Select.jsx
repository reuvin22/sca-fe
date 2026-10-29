import { ChevronDown } from 'lucide-react'
import { fieldClass } from '../../utils/styles'

// `options` is a list of { value, label }.
function Select({ label, id, options, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select id={id} name={id} className={`cursor-pointer appearance-none pr-10 ${fieldClass()}`} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  )
}

export default Select
