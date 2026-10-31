import { Eye, FileSearch, Link2, Pencil, Trash2 } from 'lucide-react'
import ExportMenu from '../common/ExportMenu'
import { formatDate } from '../../utils/dateHelpers'
import { FORM_EXPORT_FORMATS, exportForm } from '../../utils/export/exportForm'

const iconButton = 'cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800'

// One form: title, description, dates, Export (PDF / Word), and Preview / Edit / Answer link / Responses / Delete buttons
function FormCard({ form, onPreview, onShare, onEdit, onViewResponses, onDelete }) {
  const count = form.questions.filter((question) => question.type !== 'section').length

  return (
    <article className="flex flex-col rounded-xl border border-gray-100 bg-surface p-5 shadow-sm">
      <h3 className="font-semibold wrap-break-word text-gray-900">{form.title}</h3>
      <p className="mt-1 line-clamp-3 flex-1 text-sm wrap-break-word text-gray-500">
        {form.description || 'No description.'}
      </p>

      <p className="mt-3 text-xs text-gray-400">
        {count} question{count === 1 ? '' : 's'} · Updated {formatDate(form.updatedAt.slice(0, 10))}
      </p>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <ExportMenu only={FORM_EXPORT_FORMATS} onExport={(format) => exportForm(form, format)} />
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onPreview(form)}
            className={iconButton}
            aria-label={`Preview ${form.title}`}
            title="Preview"
          >
            <FileSearch size={16} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(form)}
            className={iconButton}
            aria-label={`Edit ${form.title}`}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onShare(form)}
            className={iconButton}
            aria-label={`Answer link for ${form.title}`}
            title="Answer link"
          >
            <Link2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => onViewResponses(form)}
            className={iconButton}
            aria-label={`View responses for ${form.title}`}
            title="View responses"
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(form)}
            className={`${iconButton} hover:bg-red-50 hover:text-red-600`}
            aria-label={`Delete ${form.title}`}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default FormCard
