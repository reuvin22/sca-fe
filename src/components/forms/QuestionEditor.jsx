import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import TagInput from '../ui/TagInput'
import HeaderLabelInput from './HeaderLabelInput'
import {
  COLUMN_OPTIONS,
  LAYOUT_OPTIONS,
  LAYOUT_TYPES,
  OPTION_TYPES,
  QUESTION_TYPES,
  VARIABLES,
  variableField,
  WIDTH_OPTIONS,
} from '../../utils/formBuilderHelpers'

const HEADER_TYPES = QUESTION_TYPES.filter((type) => type.value !== 'section')

const iconButton =
  'cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30'

// One question (or section heading): text, answer type, width, required, parts, and choices/layout
// for dropdown, radio and checkbox. `number` is the question number (none for headings);
// `position`/`total` enable the move buttons. `onChange(changes)` merges the changes into the question.
// `isHeader`: a student detail at the top of the form (not numbered, no section headings).
function QuestionEditor({ question, number, position, total, isHeader, errors = {}, onChange, onMove, onRemove }) {
  const isSection = question.type === 'section'
  const hasOptions = OPTION_TYPES.includes(question.type)
  const hasLayout = LAYOUT_TYPES.includes(question.type)
  const variable = VARIABLES.find((item) => item.variable === question.variable)

  return (
    <section className={`rounded-xl bg-surface p-5 shadow-sm ${isSection ? 'border-l-4 border-brand-600' : ''}`}>
      <header className="mb-4 flex items-center gap-2">
        {isSection || isHeader ? (
          <span className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
            {isHeader ? 'Header field' : 'Section heading'}
          </span>
        ) : (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
            {number}
          </span>
        )}
        {variable && (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
            Variable: {variable.label}
          </span>
        )}
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={position === 1}
            className={iconButton}
            aria-label="Move up"
          >
            <ArrowUp size={16} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={position === total}
            className={iconButton}
            aria-label="Move down"
          >
            <ArrowDown size={16} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className={`${iconButton} hover:bg-red-50 hover:text-red-600`}
            aria-label={isSection || isHeader ? 'Delete' : `Delete question ${number}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
        {isHeader ? (
          <HeaderLabelInput
            id={`label-${question.id}`}
            value={question.label}
            error={errors.label}
            onChange={(label) => onChange({ label })}
            onPickVariable={(variable) => {
              // Same field, now with the variable's label, type, width and parts
              const preset = variableField(variable)
              delete preset.id
              onChange(preset)
            }}
          />
        ) : (
          <Input
            id={`label-${question.id}`}
            aria-label={isSection ? 'Section heading' : `Question ${number}`}
            placeholder={isSection ? 'e.g. Personal Information' : 'Type the question'}
            value={question.label}
            onChange={(e) => onChange({ label: e.target.value })}
            error={errors.label}
            maxLength={500}
          />
        )}
        <Select
          id={`type-${question.id}`}
          aria-label={isSection ? 'Item type' : `Answer type for question ${number}`}
          options={isHeader ? HEADER_TYPES : QUESTION_TYPES}
          value={question.type}
          onChange={(e) => onChange({ type: e.target.value })}
        />
      </div>

      {hasOptions && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">Options</p>
          <TagInput
            id={`option-${question.id}`}
            items={question.options}
            placeholder="Type an option, then Add"
            onAdd={(option) => onChange({ options: [...question.options, option] })}
            onRemove={(option) => onChange({ options: question.options.filter((item) => item !== option) })}
          />
          {errors.options && <p className="text-xs text-red-600">{errors.options}</p>}
        </div>
      )}

      {hasLayout && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <Select
            id={`layout-${question.id}`}
            label="Show options"
            options={LAYOUT_OPTIONS}
            value={question.layout}
            onChange={(e) => onChange({ layout: e.target.value })}
          />
          {question.layout === 'grid' && (
            <Select
              id={`columns-${question.id}`}
              aria-label="Number of columns"
              options={COLUMN_OPTIONS}
              value={String(question.columns)}
              onChange={(e) => onChange({ columns: Number(e.target.value) })}
            />
          )}
        </div>
      )}

      {question.type === 'text' && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">Split into parts (optional)</p>
          <p className="text-xs text-gray-500">
            Each part is a blank with a small label under it, e.g. First / Middle / Last.
          </p>
          <TagInput
            id={`part-${question.id}`}
            items={question.parts}
            placeholder="Type a part label, then Add"
            onAdd={(part) => question.parts.length < 6 && onChange({ parts: [...question.parts, part] })}
            onRemove={(part) => onChange({ parts: question.parts.filter((item) => item !== part) })}
          />
        </div>
      )}

      {!isSection && (
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="w-44">
            <Select
              id={`width-${question.id}`}
              aria-label="Width in the row"
              options={WIDTH_OPTIONS}
              value={question.width}
              onChange={(e) => onChange({ width: e.target.value })}
            />
          </div>
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => onChange({ required: e.target.checked })}
              className="size-4 cursor-pointer accent-brand-600"
            />
            Required
          </label>
        </div>
      )}
    </section>
  )
}

export default QuestionEditor
