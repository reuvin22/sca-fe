import Modal from '../ui/Modal'
import PdfPagesView from './PdfPagesView'

// Shows a PDF made on the fly: only the pages, scrollable (no browser PDF viewer).
// `load()` returns a Blob (called once when opened); `children` adds buttons above the preview (e.g. "Use template").
function PdfPreviewModal({ title, load, onClose, children }) {
  return (
    <Modal title={title} onClose={onClose} className="max-w-4xl">
      {children && <div className="mb-3 flex flex-wrap justify-end gap-2">{children}</div>}
      <PdfPagesView load={load} title={title} />
    </Modal>
  )
}

export default PdfPreviewModal
