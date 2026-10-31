// PDF editor helpers: reading a PDF (pdf.js), drawing its pages, and saving the edited PDF (pdf-lib).
// Everything runs in the browser; the file is not uploaded unless the user saves it to PDF Documents.

export const A4 = { width: 595.28, height: 841.89 } // PDF points
const PAGE_IMAGE_SCALE = 2 // page background is drawn at 2× for sharp zooming
const EXPORT_SCALE = 3 // edits are saved at 3× the page size (about 216 dpi)

// Fonts available on almost every computer (no download needed)
export const FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Calibri',
  'Cambria',
  'Segoe UI',
  'Comic Sans MS',
  'Impact',
].map((font) => ({ value: font, label: font }))

export const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72].map((size) => ({
  value: String(size),
  label: String(size),
}))

// Settings used for new objects and shown for the selected one
export const DEFAULT_STYLE = {
  fontFamily: 'Arial',
  fontSize: 12,
  textColor: '#111827',
  bold: false,
  italic: false,
  underline: false,
  align: 'left',
  stroke: '#7c3aed',
  fill: '#ffffff00', // transparent
  strokeWidth: 2,
  opacity: 1,
  penColor: '#111827',
  penWidth: 2,
}

let pdfjs
export async function loadPdfJs() {
  if (!pdfjs) {
    const [lib, worker] = await Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')])
    lib.GlobalWorkerOptions.workerSrc = worker.default
    pdfjs = lib
  }
  return pdfjs
}

// Reads a PDF file. Returns { bytes, pages: [{ key, width, height, image, source }] } where `image` is the
// drawn page (data URL) and `source` its index in the original file. Throws a friendly Error.
export async function readPdf(file) {
  return readPdfBytes(new Uint8Array(await file.arrayBuffer()))
}

export async function readPdfBytes(bytes) {
  const lib = await loadPdfJs()
  // pdf.js may take ownership of the buffer, so it gets a copy
  const task = lib.getDocument({ data: bytes.slice() })
  let doc
  try {
    doc = await task.promise
  } catch (error) {
    if (error?.name === 'PasswordException')
      throw new Error('This PDF is password-protected. Remove the password and try again.', { cause: error })
    throw new Error('This file could not be opened as a PDF.', { cause: error })
  }
  const pages = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const { width, height } = page.getViewport({ scale: 1 })
    const viewport = page.getViewport({ scale: PAGE_IMAGE_SCALE })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport }).promise
    pages.push({ key: crypto.randomUUID(), width, height, image: canvas.toDataURL('image/png'), source: i - 1 })
  }
  await task.destroy()
  return { bytes, pages }
}

// The editable project kept in Document Storage: page sizes, which original page each one is,
// and the objects added to each page
export const toProject = (pages, objectsOf) => ({
  version: 1,
  pages: pages.map(({ width, height, source }) => ({ width, height, source })),
  objects: pages.map(objectsOf),
})

// Pages of a stored document: original pages are drawn again from its PDF (`rendered`)
export const pagesFromProject = (project, rendered = []) =>
  project.pages.map((page, i) => ({
    key: crypto.randomUUID(),
    width: page.width,
    height: page.height,
    source: page.source,
    image: page.source !== null ? (rendered[page.source]?.image ?? null) : null,
    objects: project.objects[i] ?? [],
  }))

export const blankPage = (size = A4) => ({
  key: crypto.randomUUID(),
  width: size.width,
  height: size.height,
  image: null,
  source: null,
})

// Builds the edited PDF. Original pages keep their own text and graphics; the edits on each page are
// added on top as one image. `overlays[i]` is a PNG data URL of page i's edits, or null when it has none.
export async function buildPdf({ bytes, pages, overlays }) {
  const { PDFDocument, degrees } = await import('pdf-lib')
  const output = await PDFDocument.create()
  const source = bytes ? await PDFDocument.load(bytes, { ignoreEncryption: true }) : null

  for (const [i, page] of pages.entries()) {
    let pdfPage
    if (page.source !== null && source) {
      ;[pdfPage] = await output.copyPages(source, [page.source])
      output.addPage(pdfPage)
    } else {
      pdfPage = output.addPage([page.width, page.height])
    }
    if (!overlays[i]) continue
    const image = await output.embedPng(overlays[i])
    // Rotated pages: draw the edits turned the same way so they line up with what was shown
    const angle = pdfPage.getRotation().angle % 360
    const { width, height } = pdfPage.getSize()
    const place = {
      0: { x: 0, y: 0, width, height },
      90: { x: 0, y: height, width: height, height: width, rotate: degrees(-90) },
      180: { x: width, y: height, width, height, rotate: degrees(180) },
      270: { x: width, y: 0, width: height, height: width, rotate: degrees(90) },
    }[angle] ?? { x: 0, y: 0, width, height }
    pdfPage.drawImage(image, place)
  }
  return new Blob([await output.save()], { type: 'application/pdf' })
}

// PNG of one page's edits (no page background), or null when the page has none
export function overlayImage(canvas) {
  if (!canvas.getObjects().length) return null
  canvas.discardActiveObject()
  // Only the edits: the page itself (image or white) is left out
  const { backgroundImage, backgroundColor } = canvas
  canvas.backgroundImage = undefined
  canvas.backgroundColor = ''
  const url = canvas.toDataURL({ format: 'png', multiplier: EXPORT_SCALE / canvas.getZoom() })
  canvas.backgroundImage = backgroundImage
  canvas.backgroundColor = backgroundColor
  canvas.requestRenderAll()
  return url
}

// A PDF straight from a project (no editor open), e.g. to preview a template
export async function projectToPdfBlob(project) {
  const { StaticCanvas, util } = await import('fabric')
  const overlays = []
  for (const [i, page] of project.pages.entries()) {
    const canvas = new StaticCanvas(undefined, { width: page.width, height: page.height })
    const objects = await util.enlivenObjects(project.objects[i] ?? [])
    if (objects.length) canvas.add(...objects)
    canvas.renderAll()
    overlays.push(objects.length ? canvas.toDataURL({ format: 'png', multiplier: EXPORT_SCALE }) : null)
    canvas.dispose()
  }
  return buildPdf({ bytes: null, pages: project.pages, overlays })
}
