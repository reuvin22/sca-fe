import { Download, FileQuestion, LoaderCircle } from 'lucide-react'
import Modal from '../ui/Modal'
import Skeleton from '../ui/Skeleton'
import SheetPreview from './SheetPreview'
import { formatSize, getFileKind } from '../../utils/fileHelpers'

// Shows images, PDFs, CSV and Excel (.xlsx). Other types can only be downloaded.
// `file.url` is empty while the file is still downloading.
function FilePreviewModal({ file, onClose }) {
  const kind = getFileKind(file.name).label

  if (!file.url) {
    return (
      <Modal title={file.name} onClose={onClose} className="max-w-4xl">
        <Skeleton className="h-[50vh]" />
        <div className="mt-4 flex items-center justify-between gap-2 text-sm text-gray-500">
          <span>
            {kind} · {formatSize(file.size)}
          </span>
          <span className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white opacity-60">
            <LoaderCircle size={16} className="animate-spin" />
            Loading...
          </span>
        </div>
      </Modal>
    )
  }

  const preview = {
    Image: <img src={file.url} alt={file.name} loading="lazy" className="mx-auto max-h-[70vh] w-auto object-contain" />,
    PDF: <iframe src={file.url} title={file.name} className="h-[70vh] w-full rounded-lg border border-gray-200" />,
    CSV: <SheetPreview file={file} kind={kind} />,
    // Old .xls files can't be read in the browser
    Excel: file.name.toLowerCase().endsWith('.xlsx') && <SheetPreview file={file} kind={kind} />,
  }[kind]

  return (
    <Modal title={file.name} onClose={onClose} className="max-w-4xl">
      {preview || (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <FileQuestion size={40} className="text-gray-300" />
          <p className="text-sm text-gray-600">Preview is not available for this file.</p>
          <p className="text-xs text-gray-400">Download the file to open it.</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 text-sm text-gray-500">
        <span>
          {kind} · {formatSize(file.size)}
        </span>
        <a
          href={file.url}
          download={file.name}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover"
        >
          <Download size={16} />
          Download
        </a>
      </div>
    </Modal>
  )
}

export default FilePreviewModal
