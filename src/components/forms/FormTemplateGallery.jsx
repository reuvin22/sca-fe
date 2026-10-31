import { useState } from 'react'
import { ClipboardList, Eye, FilePlus2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import PdfPreviewModal from '../common/PdfPreviewModal'
import { FORM_TEMPLATES, toBuilderForm } from '../../utils/templates/formTemplates'

// How a new form starts: blank, or from a ready-made form (previewed first if wanted).
// `onStart(form)` opens the builder; `form` is null for a blank form.
function FormTemplateGallery({ onStart, onClose }) {
  const [previewing, setPreviewing] = useState(null)

  // The printable form, exactly as Preview / Export would show it
  const previewBlob = async (template) => {
    const { formPdfBlob } = await import('../../utils/export/exportFormPdf')
    return formPdfBlob(toBuilderForm(template))
  }

  return (
    <>
      <Modal title="New form" onClose={onClose} className="max-w-5xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => onStart(null)}
            className="flex cursor-pointer flex-col items-start gap-2 rounded-xl border-2 border-dashed border-gray-300 p-4 text-left transition hover:border-brand-400"
          >
            <FilePlus2 size={28} className="text-brand-600" />
            <span className="font-semibold text-gray-900">Blank form</span>
            <span className="text-xs text-gray-500">Start from scratch with Name, Date and Grade & Section.</span>
          </button>
          {FORM_TEMPLATES.map((template) => (
            <article key={template.id} className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4">
              <ClipboardList size={28} className="text-brand-600" />
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
                <Button fullWidth={false} className="flex-1 px-2" onClick={() => onStart(toBuilderForm(template))}>
                  Use
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Modal>

      {previewing && (
        <PdfPreviewModal
          title={`Preview · ${previewing.name}`}
          load={() => previewBlob(previewing)}
          onClose={() => setPreviewing(null)}
        >
          <Button fullWidth={false} onClick={() => onStart(toBuilderForm(previewing))}>
            Use this template
          </Button>
        </PdfPreviewModal>
      )}
    </>
  )
}

export default FormTemplateGallery
