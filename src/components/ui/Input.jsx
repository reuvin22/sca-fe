import { fieldClass } from '../../utils/styles'

function Input({ label, id, error, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input id={id} name={id} className={fieldClass(error)} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default Input
