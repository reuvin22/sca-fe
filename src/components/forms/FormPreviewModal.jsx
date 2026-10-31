import ExportMenu from '../common/ExportMenu'
import PdfPreviewModal from '../common/PdfPreviewModal'
import { FORM_EXPORT_FORMATS, exportForm } from '../../utils/export/exportForm'

// The printable form (the same PDF as the download): only its pages, scrollable
async function formBlob(form) {
  const { formPdfBlob } = await import('../../utils/export/exportFormPdf')
  return formPdfBlob(form)
}

function FormPreviewModal({ form, onClose }) {
  return (
    <PdfPreviewModal title={`Preview · ${form.title || 'Untitled form'}`} load={() => formBlob(form)} onClose={onClose}>
      <ExportMenu only={FORM_EXPORT_FORMATS} onExport={(format) => exportForm(form, format)} />
    </PdfPreviewModal>
  )
}

export default FormPreviewModal
