import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Download, FileSearch, Plus, Save, Trash2, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import PdfToolbar from './PdfToolbar'
import PdfPageCanvas from './PdfPageCanvas'
import TemplateGallery from './TemplateGallery'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import ConfirmModal from '../ui/ConfirmModal'
import PdfPreviewModal from '../common/PdfPreviewModal'
import Skeleton from '../ui/Skeleton'
import usePdfEditor from '../../hooks/usePdfEditor'
import useKeepDraftOnLeave from '../../hooks/useKeepDraftOnLeave'
import useRequest from '../../hooks/useRequest'
import { saveFile } from '../../utils/export/exportTheme'

const MAX_SIZE_MB = 50 // same limit as Files

// PDF editor: open a PDF (or start blank), edit its pages on a canvas, then save it to Document Storage,
// download it or preview it. `id`: a stored document to open. `onSaved(saved)` runs after the first save.
// Leaving with unsaved changes keeps them as a draft in Document Storage.
function PdfEditor({ id, onSaved }) {
  const editor = usePdfEditor()
  const { doc } = editor
  const fileInput = useRef(null)
  const [toDelete, setToDelete] = useState(null)
  const [previewBlob, setPreviewBlob] = useState(null) // the PDF as it will be saved, while previewing
  const [loadError, setLoadError] = useState('')
  const open = useRequest(editor.openFile)
  const fileName = () => `${doc.name.trim() || 'document'}.pdf`
  const download = useRequest(async () => saveFile(await editor.exportBlob(), fileName()))
  const save = useRequest(async () => {
    const isNew = !doc.id
    const saved = await editor.save(false)
    toast.success('Document saved')
    if (isNew) onSaved?.(saved)
  })

  // A stored document: opened once (saving a new one gives it an id without reloading)
  const openStored = editor.openStored
  const storedId = doc?.id
  useEffect(() => {
    if (!id || id === storedId) return
    openStored(id).catch((error) => setLoadError(error.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Shows the PDF exactly as it will be saved, without downloading it
  const preview = useRequest(async () => setPreviewBlob(await editor.exportBlob()))

  const handleOpen = (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return toast.error(`PDF files must be ${MAX_SIZE_MB} MB or smaller.`)
    open.run(file)
  }

  // Keyboard: Delete removes the selection, Ctrl+Z / Ctrl+Y undo and redo (not while typing)
  const keys = useRef(null)
  useLayoutEffect(() => {
    keys.current = editor
  })

  // Leaving with unsaved changes keeps them as a draft in PDF Documents
  useKeepDraftOnLeave(
    {
      isDirty: () => editor.dirty && Boolean(doc),
      saveDraft: () => editor.save(true),
      name: doc?.name || 'Untitled document',
    },
    'PDF Documents',
  )
  useEffect(() => {
    const onKey = (e) => {
      // Escape finishes typing in a text box (the text stays selected, so arrows then move it)
      const editing = keys.current.activeCanvas()?.getActiveObject()
      if (e.key === 'Escape' && editing?.isEditing) {
        editing.exitEditing()
        keys.current.activeCanvas().requestRenderAll()
        e.preventDefault()
        return
      }
      const typing =
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
        keys.current.activeCanvas()?.getActiveObject()?.isEditing
      if (typing || !keys.current.doc) return
      const ctrl = e.ctrlKey || e.metaKey
      if (e.key === 'Delete' || e.key === 'Backspace') keys.current.deleteSelected()
      else if (ctrl && e.key.toLowerCase() === 'z' && !e.shiftKey) keys.current.undo()
      else if (ctrl && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) keys.current.redo()
      else if (e.key.startsWith('Arrow')) {
        const step = e.shiftKey ? 10 : 1
        const [dx, dy] = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[
          e.key
        ]
        if (!keys.current.nudgeSelected(dx, dy)) return
      } else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openButton = (
    <>
      <input ref={fileInput} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleOpen} />
      <Button variant="outline" fullWidth={false} loading={open.loading} onClick={() => fileInput.current.click()}>
        {!open.loading && <Upload size={16} />}
        Open PDF
      </Button>
    </>
  )

  if (loadError) return <Alert>{loadError}</Alert>
  if (!doc && id) return <Skeleton className="h-[70vh] rounded-xl" />

  // A new document: start blank, from a PDF, or from a template
  if (!doc) {
    return (
      <>
        <input ref={fileInput} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleOpen} />
        <Alert>{open.error}</Alert>
        <TemplateGallery
          opening={open.loading}
          onBlank={editor.newBlank}
          onOpenFile={() => fileInput.current.click()}
          onTemplate={editor.newFromTemplate}
        />
      </>
    )
  }

  return (
    <div className="space-y-4">
      {/* Actions and tools stay pinned under the navbar while scrolling through the pages */}
      <div className="sticky top-16 z-[5] space-y-2 rounded-xl border border-gray-100 bg-surface/95 p-2 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-2">
          <div className="mr-auto flex min-w-0 flex-1 items-center gap-2">
            <input
              aria-label="Document name"
              value={doc.name}
              maxLength={150}
              placeholder="Untitled document"
              onChange={(e) => editor.rename(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm font-semibold text-gray-900 hover:border-gray-200 focus:border-brand-500 focus:outline-none sm:max-w-xs"
            />
            <span className="shrink-0 text-xs text-gray-500">
              {doc.pages.length} page{doc.pages.length === 1 ? '' : 's'}
              {editor.dirty ? ' · Unsaved changes' : doc.id ? ' · Saved' : ''}
            </span>
          </div>
          {!doc.id && openButton}
          <Button variant="outline" fullWidth={false} onClick={editor.addPage}>
            <Plus size={16} />
            Add page
          </Button>
          <Button variant="outline" fullWidth={false} loading={preview.loading} onClick={preview.run}>
            {!preview.loading && <FileSearch size={16} />}
            Preview
          </Button>
          <Button variant="outline" fullWidth={false} loading={download.loading} onClick={download.run}>
            {!download.loading && <Download size={16} />}
            Download
          </Button>
          <Button fullWidth={false} loading={save.loading} onClick={save.run}>
            {!save.loading && <Save size={16} />}
            Save
          </Button>
        </div>
        {(open.error || preview.error || download.error || save.error) && (
          <p className="text-sm text-red-600">{open.error || preview.error || download.error || save.error}</p>
        )}
        <PdfToolbar editor={editor} />
      </div>

      {/* Pages scroll sideways on small screens instead of shrinking */}
      <div className="space-y-6 overflow-x-auto rounded-xl bg-gray-100 p-4 sm:p-6">
        {doc.pages.map((page, index) => (
          <div key={page.key} className="space-y-2">
            <div
              className="mx-auto flex max-w-full items-center justify-between gap-2"
              style={{ width: page.width * editor.zoom }}
            >
              <span className="text-xs font-medium text-gray-500">Page {index + 1}</span>
              <button
                type="button"
                disabled={doc.pages.length === 1}
                onClick={() => setToDelete(page.key)}
                className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={14} />
                Delete page
              </button>
            </div>
            <PdfPageCanvas
              page={page}
              zoom={editor.zoom}
              tool={editor.tool}
              style={editor.style}
              active={page.key === editor.activeKey}
              onActivate={editor.setActiveKey}
              onRegister={editor.registerCanvas}
              onUnregister={editor.unregisterCanvas}
              onChange={editor.recordChange}
              onSelect={editor.selectObject}
              onToolDone={() => editor.setTool('select')}
            />
          </div>
        ))}
      </div>

      {previewBlob && (
        <PdfPreviewModal
          title={`Preview · ${doc.name || 'Untitled document'}.pdf`}
          load={() => Promise.resolve(previewBlob)}
          onClose={() => setPreviewBlob(null)}
        />
      )}

      {toDelete && (
        <ConfirmModal
          title="Delete page?"
          message="This page and everything added to it will be removed from the PDF."
          onConfirm={() => {
            editor.deletePage(toDelete)
            setToDelete(null)
          }}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  )
}

export default PdfEditor
