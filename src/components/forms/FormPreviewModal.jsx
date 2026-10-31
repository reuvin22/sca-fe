import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import Modal from '../ui/Modal'
import Alert from '../ui/Alert'
import ExportMenu from '../common/ExportMenu'
import { FORM_EXPORT_FORMATS, exportForm, formPreviewUrl } from '../../utils/export/exportForm'

// Shows the printable form (the same PDF as the download) without downloading it
function FormPreviewModal({ form, onClose }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  // Built once when opened; the blob URL is freed when the preview closes
  useEffect(() => {
    let created = ''
    let ignore = false
    formPreviewUrl(form)
      .then((next) => {
        created = next
        if (ignore) URL.revokeObjectURL(next)
        else setUrl(next)
      })
      .catch(() => !ignore && setError('Could not build the preview. Please try again.'))
    return () => {
      ignore = true
      if (created) URL.revokeObjectURL(created)
    }
  }, [form])

  return (
    <Modal title={`Preview · ${form.title}`} onClose={onClose} className="max-w-4xl">
      <div className="mb-3 flex justify-end">
        <ExportMenu only={FORM_EXPORT_FORMATS} onExport={(format) => exportForm(form, format)} />
      </div>
      <Alert>{error}</Alert>
      {!url && !error && (
        <div className="flex h-[70vh] items-center justify-center rounded-lg border border-gray-200">
          <LoaderCircle size={24} className="animate-spin text-gray-400" />
        </div>
      )}
      {url && (
        <iframe
          src={url}
          title={`Preview of ${form.title}`}
          className="h-[70vh] w-full rounded-lg border border-gray-200"
        />
      )}
    </Modal>
  )
}

export default FormPreviewModal
