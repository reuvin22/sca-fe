import { useEffect, useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import Modal from '../ui/Modal'
import Alert from '../ui/Alert'

// Shows a PDF made on the fly. `load()` returns a Blob (called once when opened); `children` adds
// buttons above the preview (e.g. "Use template").
function PdfPreviewModal({ title, load, onClose, children }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const loader = useRef(load)

  useEffect(() => {
    let created = ''
    let ignore = false
    loader
      .current()
      .then((blob) => {
        created = URL.createObjectURL(blob)
        if (ignore) URL.revokeObjectURL(created)
        else setUrl(created)
      })
      .catch(() => !ignore && setError('Could not build the preview. Please try again.'))
    return () => {
      ignore = true
      if (created) URL.revokeObjectURL(created)
    }
  }, [])

  return (
    <Modal title={title} onClose={onClose} className="max-w-4xl">
      {children && <div className="mb-3 flex flex-wrap justify-end gap-2">{children}</div>}
      <Alert>{error}</Alert>
      {!url && !error && (
        <div className="flex h-[70vh] items-center justify-center rounded-lg border border-gray-200">
          <LoaderCircle size={24} className="animate-spin text-gray-400" />
        </div>
      )}
      {url && (
        <iframe src={url} title={`Preview of ${title}`} className="h-[70vh] w-full rounded-lg border border-gray-200" />
      )}
    </Modal>
  )
}

export default PdfPreviewModal
