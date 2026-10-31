import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import DatePicker from '../ui/DatePicker'
import { fieldClass } from '../../utils/styles'

const GRID_COLUMNS = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' }
const PART_COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
}

// One question of a public form as a real input. `value` is text, or a list for checkboxes
// and split parts. `onChange(value)` gets the new value.
function AnswerField({ question, value, error, onChange }) {
  const id = `answer-${question.id}`
  const label = (
    <span>
      {question.number && <span className="mr-1">{question.number}.</span>}
      {question.label}
      {question.required && <span className="ml-0.5 text-red-600">*</span>}
    </span>
  )
  const errorText = error && <p className="text-xs text-red-600">{error}</p>

  // Radio buttons and checkboxes, in a row or in columns
  if (question.type === 'radio' || question.type === 'checkbox') {
    const picked = (option) => (question.type === 'checkbox' ? value.includes(option) : value === option)
    const toggle = (option) =>
      question.type === 'checkbox'
        ? onChange(picked(option) ? value.filter((item) => item !== option) : [...value, option])
        : onChange(option)
    return (
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium text-gray-800">{label}</legend>
        <div
          className={
            question.layout === 'grid'
              ? `grid gap-2 ${GRID_COLUMNS[question.columns]}`
              : 'flex flex-wrap gap-x-5 gap-y-2'
          }
        >
          {question.options.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type={question.type}
                name={id}
                checked={picked(option)}
                onChange={() => toggle(option)}
                className="size-4 cursor-pointer accent-brand-600"
              />
              {option}
            </label>
          ))}
        </div>
        {errorText}
      </fieldset>
    )
  }

  if (question.type === 'select') {
    const options = [
      { value: '', label: 'Select an answer' },
      ...question.options.map((option) => ({ value: option, label: option })),
    ]
    return (
      <div className="space-y-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-800">
          {label}
        </label>
        <Select id={id} options={options} value={value} error={error} onChange={(e) => onChange(e.target.value)} />
      </div>
    )
  }

  if (question.type === 'date') {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <DatePicker id={id} value={value} error={error} onChange={(e) => onChange(e.target.value)} />
      </div>
    )
  }

  // Short answer split into parts: one box per part with its small label under it
  if (question.type === 'text' && question.parts.length) {
    return (
      <fieldset className="space-y-1">
        <legend className="mb-1 text-sm font-medium text-gray-800">{label}</legend>
        <div className={`grid gap-3 ${PART_COLUMNS[question.parts.length] ?? ''}`}>
          {question.parts.map((part, i) => (
            <div key={part}>
              <input
                aria-label={part}
                value={value[i]}
                maxLength={500}
                onChange={(e) => onChange(value.map((item, j) => (j === i ? e.target.value : item)))}
                className={fieldClass(error)}
              />
              <p className="mt-0.5 text-xs text-gray-500">{part}</p>
            </div>
          ))}
        </div>
        {errorText}
      </fieldset>
    )
  }

  if (question.type === 'file') {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">
          Files can&apos;t be sent through this link. Please give it to your counselor.
        </p>
      </div>
    )
  }

  const heading = (
    <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-800">
      {label}
    </label>
  )
  if (question.type === 'textarea') {
    return (
      <div>
        {heading}
        <Textarea
          id={id}
          rows={4}
          value={value}
          error={error}
          maxLength={5000}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }
  return (
    <div>
      {heading}
      <Input
        id={id}
        type={question.type}
        value={value}
        error={error}
        maxLength={500}
        onChange={(e) => onChange(e.target.value)}
        // Sliders and color pickers get their own size; other inputs keep the normal field style
        {...((question.type === 'range' || question.type === 'color') && { className: 'h-10 w-full cursor-pointer' })}
      />
    </div>
  )
}

export default AnswerField
