import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import Alert from '../ui/Alert'
import { loadPdfJs } from '../../utils/pdfEditorHelpers'

const SCALE = 1.6 // drawn a little larger than A4 so it stays sharp when it fills the window

// Draws a PDF's pages as images, one under another: just the document, without the browser's
// PDF viewer (no side thumbnails or toolbar), and it works on phones too. `blob` is the PDF.
async function drawPages(blob) {
  const lib = await loadPdfJs()
  const task = lib.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) })
  const doc = await task.promise
  const pages = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const viewport = page.getViewport({ scale: SCALE })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport }).promise
    pages.push({ url: canvas.toDataURL('image/png'), width: viewport.width, height: viewport.height })
  }
  await task.destroy()
  return pages
}

// Scrollable stack of pages. `load()` returns the PDF Blob (called once).
function PdfPagesView({ load, title = 'Document' }) {
  const [pages, setPages] = useState(null)
  const [error, setError] = useState('')
  const [loader] = useState(() => load)

  useEffect(() => {
    let ignore = false
    loader()
      .then(drawPages)
      .then((drawn) => !ignore && setPages(drawn))
      .catch(() => !ignore && setError('Could not build the preview. Please try again.'))
    return () => {
      ignore = true
    }
  }, [loader])

  if (error) return <Alert>{error}</Alert>
  if (!pages) {
    return (
      <div className="flex h-[65vh] items-center justify-center rounded-lg bg-gray-100 sm:h-[70vh]">
        <LoaderCircle size={24} className="animate-spin text-gray-400" />
      </div>
    )
  }
  return (
    // Phones: almost no padding so the page is as wide as the screen allows
    <div className="h-[65vh] space-y-3 overflow-y-auto overscroll-contain rounded-lg bg-gray-100 p-1.5 sm:h-[70vh] sm:space-y-4 sm:p-6">
      {pages.map((page, i) => (
        <img
          key={i}
          src={page.url}
          width={page.width}
          height={page.height}
          alt={`${title}, page ${i + 1} of ${pages.length}`}
          className="mx-auto block h-auto w-full max-w-3xl bg-white shadow-md"
        />
      ))}
    </div>
  )
}

export default PdfPagesView
