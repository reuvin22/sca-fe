import { toDateString } from '../dateHelpers'
import { recordFormExport } from '../../services/formService'

// Printable blank form as PDF or Word. The libraries load only when used.
// Downloads of a saved form (it has an id) are counted for its Responses view.
export async function exportForm(form, format) {
  const slug =
    form.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'form'
  const fileName = `${slug}-${toDateString()}`
  if (format === 'pdf') await (await import('./exportFormPdf')).exportFormPdf(form, fileName)
  if (format === 'word') await (await import('./exportFormDocx')).exportFormDocx(form, fileName)
  // Counting must never stop the download
  if (form.id) recordFormExport(form.id, format).catch(() => {})
}

// Blob URL of the printable PDF, for the preview
export async function formPreviewUrl(form) {
  return (await import('./exportFormPdf')).formPdfUrl(form)
}

export const FORM_EXPORT_FORMATS = ['pdf', 'word']
