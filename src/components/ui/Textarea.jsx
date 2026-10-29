import { fieldClass } from '../../utils/styles'

function Textarea({ label, id, error, rows = 3, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea id={id} name={id} rows={rows} className={`resize-y ${fieldClass(error)}`} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default Textarea
