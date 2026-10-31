import { useRef, useState } from 'react'
import { FabricImage, util } from 'fabric'
import { createDocument, getDocument, getDocumentSource, updateDocument } from '../services/documentService'
import { layoutTemplate } from '../utils/templates/templateLayout'
import {
  DEFAULT_STYLE,
  blankPage,
  buildPdf,
  overlayImage,
  pagesFromProject,
  readPdf,
  readPdfBytes,
  toProject,
} from '../utils/pdfEditorHelpers'

// State of the PDF editor. Each page has its own Fabric canvas (registered by PdfPageCanvas);
// `canvases` maps page key → canvas. Undo/redo keeps snapshots of the page that changed.
// `dirty`: there are changes not yet saved to Document Storage (kept as a draft when leaving).
// A locked object can't be moved, resized or rotated by accident (e.g. a background logo)
const LOCK_PROPS = ['lockMovementX', 'lockMovementY', 'lockScalingX', 'lockScalingY', 'lockRotation', 'hasControls']

function usePdfEditor() {
  const [doc, setDoc] = useState(null) // { id (once stored), name, bytes, pages }
  const [dirty, setDirty] = useState(false)
  const [activeKey, setActiveKey] = useState(null)
  const [tool, setTool] = useState('select')
  const [style, setStyle] = useState(DEFAULT_STYLE)
  const [zoom, setZoom] = useState(1.25)
  const [selected, setSelected] = useState(null) // the selected object, if any
  const [, setLockChanges] = useState(0) // redraws the toolbar after locking / unlocking
  const [history, setHistory] = useState({ undo: [], redo: [] })
  const canvases = useRef(new Map())
  const snapshots = useRef(new Map()) // page key → last saved snapshot
  const restoring = useRef(false)

  const activeCanvas = () => canvases.current.get(activeKey)
  // Locked objects keep their lock in undo / redo and when the document is stored
  const snapshot = (canvas) => canvas.getObjects().map((object) => object.toObject(LOCK_PROPS))

  const reset = (next, changed = false) => {
    setDirty(changed)
    canvases.current.clear()
    snapshots.current.clear()
    setHistory({ undo: [], redo: [] })
    setSelected(null)
    setTool('select')
    setDoc(next)
    setActiveKey(next.pages[0]?.key ?? null)
  }

  // An opened PDF counts as unsaved work (kept as a draft if the user leaves)
  const openFile = async (file) =>
    reset({ id: null, name: file.name.replace(/\.pdf$/i, ''), ...(await readPdf(file)) }, true)
  const newBlank = () => reset({ id: null, name: '', bytes: null, pages: [blankPage()] })

  // A template filled in by the user: laid out as editable pages (unsaved until Save)
  const newFromTemplate = (template, values) =>
    reset(
      { id: null, name: template.name, bytes: null, pages: pagesFromProject(layoutTemplate(template, values)) },
      true,
    )

  // Opens a document from Document Storage: its original PDF is drawn again and the edits put back
  const openStored = async (id) => {
    const stored = await getDocument(id)
    const bytes = stored.hasSource ? await getDocumentSource(id) : null
    const rendered = bytes ? (await readPdfBytes(bytes)).pages : []
    reset({ id: stored.id, name: stored.name, bytes, pages: pagesFromProject(stored.project, rendered) })
  }

  const rename = (name) => {
    setDoc((prev) => ({ ...prev, name }))
    setDirty(true)
  }

  // Saves to Document Storage (`draft`: kept automatically when leaving). Returns the stored details.
  const save = async (draft = false) => {
    const input = {
      name: doc.name.trim(),
      draft,
      project: toProject(doc.pages, (page) => snapshots.current.get(page.key) ?? page.objects ?? []),
    }
    const saved = doc.id ? await updateDocument(doc.id, input) : await createDocument({ ...input, source: doc.bytes })
    setDoc((prev) => ({ ...prev, id: saved.id }))
    setDirty(false)
    return saved
  }

  // ---- Pages ----
  const registerCanvas = (key, canvas) => {
    canvases.current.set(key, canvas)
    snapshots.current.set(key, snapshot(canvas))
  }
  const unregisterCanvas = (key) => canvases.current.delete(key)

  const addPage = () => {
    const index = doc.pages.findIndex((page) => page.key === activeKey)
    const current = doc.pages[index]
    const page = blankPage(current ? { width: current.width, height: current.height } : undefined)
    setDoc((prev) => ({ ...prev, pages: [...prev.pages.slice(0, index + 1), page, ...prev.pages.slice(index + 1)] }))
    setActiveKey(page.key)
    setDirty(true)
  }

  const deletePage = (key) => {
    setDirty(true)
    setDoc((prev) => ({ ...prev, pages: prev.pages.filter((page) => page.key !== key) }))
    setHistory((prev) => ({
      undo: prev.undo.filter((entry) => entry.key !== key),
      redo: prev.redo.filter((entry) => entry.key !== key),
    }))
    if (activeKey === key) setActiveKey(doc.pages.find((page) => page.key !== key)?.key ?? null)
  }

  // ---- Undo / redo ----
  // Called by a page after anything on it was added, changed or removed
  const recordChange = (key) => {
    const canvas = canvases.current.get(key)
    if (restoring.current || !canvas) return
    const after = snapshot(canvas)
    const before = snapshots.current.get(key) ?? []
    snapshots.current.set(key, after)
    setDirty(true)
    setHistory((prev) => ({ undo: [...prev.undo.slice(-99), { key, before, after }], redo: [] }))
  }

  const restore = async (key, objects) => {
    const canvas = canvases.current.get(key)
    if (!canvas) return
    restoring.current = true
    canvas.discardActiveObject()
    canvas.remove(...canvas.getObjects())
    canvas.add(...(await util.enlivenObjects(objects)))
    canvas.requestRenderAll()
    snapshots.current.set(key, objects)
    restoring.current = false
    setSelected(null)
  }

  const undo = async () => {
    const entry = history.undo.at(-1)
    if (!entry) return
    setHistory((prev) => ({ undo: prev.undo.slice(0, -1), redo: [...prev.redo, entry] }))
    await restore(entry.key, entry.before)
  }

  const redo = async () => {
    const entry = history.redo.at(-1)
    if (!entry) return
    setHistory((prev) => ({ undo: [...prev.undo, entry], redo: prev.redo.slice(0, -1) }))
    await restore(entry.key, entry.after)
  }

  // ---- Selected object ----
  // Shows the selected object's settings in the toolbar
  const selectObject = (object) => {
    setSelected(object)
    if (!object) return
    if (object.type === 'i-text' || object.type === 'textbox') {
      setStyle((prev) => ({
        ...prev,
        fontFamily: object.fontFamily,
        fontSize: object.fontSize,
        textColor: object.fill,
        bold: object.fontWeight === 'bold',
        italic: object.fontStyle === 'italic',
        underline: Boolean(object.underline),
        align: object.textAlign,
        opacity: object.opacity,
      }))
    } else if (object.type !== 'activeselection') {
      setStyle((prev) => ({
        ...prev,
        stroke: object.stroke ?? prev.stroke,
        fill: typeof object.fill === 'string' ? object.fill : prev.fill,
        strokeWidth: object.strokeWidth ?? prev.strokeWidth,
        opacity: object.opacity,
      }))
    }
  }

  // Puts a picture on the current page, fitted to half the page width
  const addImage = async (file) => {
    const canvas = activeCanvas()
    if (!canvas) return
    const url = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    const image = await FabricImage.fromURL(url)
    const page = doc.pages.find((item) => item.key === activeKey)
    const scale = Math.min(1, (page.width * 0.5) / image.width)
    image.set({ originX: 'left', originY: 'top', scaleX: scale, scaleY: scale })
    image.set({ left: (page.width - image.width * scale) / 2, top: (page.height - image.height * scale) / 2 })
    setTool('select')
    canvas.add(image)
    canvas.setActiveObject(image)
  }

  // Changes the settings, and the selected object when there is one
  const changeStyle = (changes) => {
    setStyle((prev) => ({ ...prev, ...changes }))
    const canvas = activeCanvas()
    const object = canvas?.getActiveObject()
    if (!object) return
    const isText = object.type === 'i-text' || object.type === 'textbox'
    const props = {}
    if (isText) {
      if ('fontFamily' in changes) props.fontFamily = changes.fontFamily
      if ('fontSize' in changes) props.fontSize = changes.fontSize
      if ('textColor' in changes) props.fill = changes.textColor
      if ('bold' in changes) props.fontWeight = changes.bold ? 'bold' : 'normal'
      if ('italic' in changes) props.fontStyle = changes.italic ? 'italic' : 'normal'
      if ('underline' in changes) props.underline = changes.underline
      if ('align' in changes) props.textAlign = changes.align
    } else {
      if ('stroke' in changes) props.stroke = changes.stroke
      if ('fill' in changes && object.type !== 'line' && object.type !== 'path') props.fill = changes.fill
      if ('strokeWidth' in changes) props.strokeWidth = changes.strokeWidth
    }
    if ('opacity' in changes) props.opacity = changes.opacity
    object.set(props)
    canvas.requestRenderAll()
    recordChange(activeKey)
  }

  const deleteSelected = () => {
    const canvas = activeCanvas()
    const objects = canvas?.getActiveObjects() ?? []
    if (!objects.length || canvas.getActiveObject()?.isEditing) return
    canvas.discardActiveObject()
    canvas.remove(...objects)
  }

  const duplicateSelected = async () => {
    const canvas = activeCanvas()
    const object = canvas?.getActiveObject()
    if (!object) return
    const copy = await object.clone()
    copy.set({ left: object.left + 12, top: object.top + 12 })
    canvas.add(copy)
    canvas.setActiveObject(copy)
  }

  // Lines the selected object up with the page: left / center / right, top / middle / bottom
  const alignSelected = (where) => {
    const canvas = activeCanvas()
    const object = canvas?.getActiveObject()
    const page = doc.pages.find((item) => item.key === activeKey)
    if (!object || !page) return
    if (object.isEditing) object.exitEditing()
    object.setCoords()
    const box = object.getBoundingRect()
    const dx = {
      left: -box.left,
      center: page.width / 2 - (box.left + box.width / 2),
      right: page.width - (box.left + box.width),
    }[where]
    const dy = {
      top: -box.top,
      middle: page.height / 2 - (box.top + box.height / 2),
      bottom: page.height - (box.top + box.height),
    }[where]
    object.set({ left: object.left + (dx ?? 0), top: object.top + (dy ?? 0) })
    object.setCoords()
    canvas.requestRenderAll()
    recordChange(activeKey)
  }

  // Arrow keys move the selection by 1 point (10 with Shift)
  const nudgeSelected = (dx, dy) => {
    const canvas = activeCanvas()
    const object = canvas?.getActiveObject()
    if (!object || object.isEditing) return false
    object.set({ left: object.left + dx, top: object.top + dy })
    object.setCoords()
    canvas.requestRenderAll()
    recordChange(activeKey)
    return true
  }

  // Layers, like Word: 'front' (on top of everything), 'forward' / 'backward' (one step),
  // 'back' (behind every other object, e.g. a logo behind the text)
  const moveLayer = (where) => {
    const canvas = activeCanvas()
    const object = canvas?.getActiveObject()
    if (!object) return
    if (where === 'front') canvas.bringObjectToFront(object)
    else if (where === 'forward') canvas.bringObjectForward(object)
    else if (where === 'backward') canvas.sendObjectBackwards(object)
    else canvas.sendObjectToBack(object)
    canvas.requestRenderAll()
    recordChange(activeKey)
  }

  // Locks / unlocks the selected object in place (it can still be selected, to unlock or delete it)
  const toggleLock = () => {
    const canvas = activeCanvas()
    const object = canvas?.getActiveObject()
    if (!object) return
    const lock = !object.lockMovementX
    object.set({
      lockMovementX: lock,
      lockMovementY: lock,
      lockScalingX: lock,
      lockScalingY: lock,
      lockRotation: lock,
      hasControls: !lock,
    })
    canvas.requestRenderAll()
    setLockChanges((count) => count + 1) // the toolbar shows the new state
    recordChange(activeKey)
  }

  // ---- Saving ----
  const exportBlob = () =>
    buildPdf({
      bytes: doc.bytes,
      pages: doc.pages,
      overlays: doc.pages.map((page) => {
        const canvas = canvases.current.get(page.key)
        return canvas ? overlayImage(canvas) : null
      }),
    })

  return {
    doc,
    dirty,
    openStored,
    newFromTemplate,
    rename,
    save,
    activeKey,
    setActiveKey,
    tool,
    setTool,
    style,
    changeStyle,
    zoom,
    setZoom,
    selected,
    selectObject,
    addImage,
    canUndo: history.undo.length > 0,
    canRedo: history.redo.length > 0,
    openFile,
    newBlank,
    registerCanvas,
    unregisterCanvas,
    addPage,
    deletePage,
    recordChange,
    undo,
    redo,
    deleteSelected,
    duplicateSelected,
    moveLayer,
    toggleLock,
    alignSelected,
    nudgeSelected,
    exportBlob,
    activeCanvas,
  }
}

export default usePdfEditor
