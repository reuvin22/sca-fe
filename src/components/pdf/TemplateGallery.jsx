import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Eye, FilePlus2, FileText, Upload } from 'lucide-react'
import TemplateFillModal from './TemplateFillModal'
import Button from '../ui/Button'
import PdfPreviewModal from '../common/PdfPreviewModal'
import { formatDate } from '../../utils/dateHelpers'
import { TEMPLATES, knownValues } from '../../utils/templates/documentTemplates'

const card =
  'flex cursor-pointer flex-col items-start gap-2 rounded-xl border border-gray-200 bg-surface p-4 text-left shadow-sm transition hover:border-brand-400 hover:shadow-md'

// A template drawn with the user's known details (school, name, today); everything else shows as blanks
async function previewBlob(template, user, school) {
  const values = knownValues(user, school)
  const [{ layoutTemplate }, { projectToPdfBlob }] = await Promise.all([
    import('../../utils/templates/templateLayout'),
    import('../../utils/pdfEditorHelpers'),
  ])
  return projectToPdfBlob(layoutTemplate(template, { ...values, date: formatDate(values.date) }))
}

// How a new PDF starts: from scratch (blank or an existing PDF) or from a ready-made template.
// Each template can be previewed first. `onBlank()`, `onOpenFile()` and `onTemplate(template, values)` start the editor.
function TemplateGallery({ onBlank, onOpenFile, onTemplate, opening }) {
  const { user, school } = useSelector((state) => state.auth)
  const [chosen, setChosen] = useState(null)
  const [previewing, setPreviewing] = useState(null)

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">Start from scratch</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button type="button" onClick={onBlank} className={card}>
            <FilePlus2 size={28} className="text-brand-600" />
            <span className="font-semibold text-gray-900">Blank document</span>
            <span className="text-xs text-gray-500">An empty A4 page.</span>
          </button>
          <button type="button" onClick={onOpenFile} disabled={opening} className={`${card} disabled:opacity-60`}>
            <Upload size={28} className="text-brand-600" />
            <span className="font-semibold text-gray-900">{opening ? 'Opening…' : 'Open a PDF'}</span>
            <span className="text-xs text-gray-500">Edit a PDF from your computer.</span>
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold tracking-wide text-gray-700 uppercase">Templates</h2>
        <p className="mb-3 text-sm text-gray-500">
          Preview a template, then fill in the details to edit it as a PDF or download it as Word.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((template) => (
            <article
              key={template.id}
              className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-surface p-4 shadow-sm"
            >
              <FileText size={28} className="text-brand-600" />
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <p className="flex-1 text-xs text-gray-500">{template.description}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  fullWidth={false}
                  className="flex-1 px-2"
                  onClick={() => setPreviewing(template)}
                >
                  <Eye size={16} />
                  Preview
                </Button>
                <Button fullWidth={false} className="flex-1 px-2" onClick={() => setChosen(template)}>
                  Use
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {previewing && (
        <PdfPreviewModal
          title={`Preview · ${previewing.name}`}
          load={() => previewBlob(previewing, user, school)}
          onClose={() => setPreviewing(null)}
        >
          <Button
            fullWidth={false}
            onClick={() => {
              setChosen(previewing)
              setPreviewing(null)
            }}
          >
            Use this template
          </Button>
        </PdfPreviewModal>
      )}

      {chosen && (
        <TemplateFillModal
          template={chosen}
          onClose={() => setChosen(null)}
          onUse={(values) => {
            setChosen(null)
            onTemplate(chosen, values)
          }}
        />
      )}
    </div>
  )
}

export default TemplateGallery
