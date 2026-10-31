import { fieldLabel, printRows } from '../formBuilderHelpers'
import { encodeForm } from '../formPayload'

// Printable blank form (A4), drawn like a paper application:
// shaded section bars, "LABEL: ______" blanks, small part labels under split blanks,
// ☐ boxes / ○ circles for choices and ruled lines for long answers.
const PAGE = { width: 595.28, height: 841.89, margin: 40 }
const CONTENT = PAGE.width - PAGE.margin * 2
const GAP = 12 // space between fields that share a row
const LABEL_SIZE = 8.5
const TEXT_SIZE = 8.5
const CHOICE_ROW = 14

// Draws (or only measures, when `draw` is false) one field. Returns its height.
function layoutField(doc, question, x, y, width, draw) {
  doc.setFont('helvetica', 'bold').setFontSize(LABEL_SIZE)
  const line = (x1, x2, lineY) => draw && doc.setLineWidth(0.6).setDrawColor(60).line(x1, lineY, x2, lineY)

  if (question.type === 'section') {
    if (draw) {
      doc
        .setFillColor(220, 230, 242)
        .setDrawColor(120, 140, 170)
        .setLineWidth(0.6)
        .rect(x, y + 4, width, 18, 'FD')
      doc
        .setFontSize(9.5)
        .setTextColor(20)
        .text(question.label.toUpperCase(), x + width / 2, y + 16.5, { align: 'center' })
    }
    return 32
  }

  // Long labels go on their own line(s); short ones sit before the blank
  const label = fieldLabel(question)
  const labelWidth = doc.getTextWidth(label) + 8
  // Numbered questions always put the answer below the question
  const stacked = Boolean(question.number) || labelWidth > width * 0.55
  const labelLines = stacked ? doc.splitTextToSize(label, width) : [label]
  if (draw) doc.setTextColor(20).text(labelLines, x, y + 10)
  const top = stacked ? y + labelLines.length * 11 : y // where the answer area starts
  const start = stacked ? x : x + labelWidth // where inline blanks start

  if (question.type === 'textarea') {
    const first = y + labelLines.length * 11 + 14
    for (let i = 0; i < 3; i++) line(x, x + width, first + i * 16)
    return first + 2 * 16 + 10 - y
  }

  if (['radio', 'checkbox', 'select'].includes(question.type)) {
    doc.setFont('helvetica', 'normal').setFontSize(TEXT_SIZE)
    const box = (bx, by) => {
      if (!draw) return
      doc.setLineWidth(0.6).setDrawColor(60)
      if (question.type === 'checkbox') doc.rect(bx, by - 6.5, 7, 7)
      else doc.circle(bx + 3.5, by - 3, 3.5)
    }
    const write = (text, tx, ty) => draw && doc.setTextColor(20).text(text, tx, ty)

    if (question.layout === 'grid') {
      // Label on its own line, then the options in columns
      const columnWidth = width / question.columns
      const firstRow = y + labelLines.length * 11 + 12
      question.options.forEach((option, i) => {
        const ox = x + (i % question.columns) * columnWidth
        const oy = firstRow + Math.floor(i / question.columns) * CHOICE_ROW
        box(ox, oy)
        write(doc.splitTextToSize(option, columnWidth - 16)[0], ox + 11, oy)
      })
      return firstRow + Math.ceil(question.options.length / question.columns) * CHOICE_ROW - y
    }

    // In a row: options flow after the label and wrap to the next line
    let cx = start
    let cy = top === y ? y + 10 : top + 10
    for (const option of question.options) {
      const optionWidth = 11 + doc.getTextWidth(option) + 12
      if (cx + optionWidth > x + width && cx > x) {
        cx = stacked ? x : start
        cy += CHOICE_ROW
      }
      box(cx, cy)
      write(option, cx + 11, cy)
      cx += optionWidth
    }
    return cy + 8 - y
  }

  // Short answers (and every other input): one blank, or labeled parts side by side
  const blankY = stacked ? top + 14 : y + 11
  const parts = question.type === 'text' ? question.parts : []
  if (!parts.length) {
    line(start, x + width, blankY)
    return blankY + 11 - y
  }
  const partGap = 8
  const partWidth = (x + width - start - partGap * (parts.length - 1)) / parts.length
  doc.setFont('helvetica', 'normal').setFontSize(6.5)
  parts.forEach((part, i) => {
    const px = start + i * (partWidth + partGap)
    line(px, px + partWidth, blankY)
    if (draw) doc.setTextColor(90).text(doc.splitTextToSize(part, partWidth)[0], px, blankY + 7.5)
  })
  return blankY + 16 - y
}

// Builds the PDF (used for both download and the in-app preview)
async function buildFormPdf(form) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  // The form itself, so importing this PDF restores it exactly
  doc.setProperties({ title: form.title, keywords: encodeForm(form) })
  const { margin } = PAGE
  let y = margin

  doc.setFont('helvetica', 'bold').setFontSize(15).setTextColor(20)
  doc.text(form.title.toUpperCase(), PAGE.width / 2, y + 12, { align: 'center' })
  y += 24
  if (form.description) {
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(90)
    const lines = doc.splitTextToSize(form.description, CONTENT)
    doc.text(lines, PAGE.width / 2, y + 6, { align: 'center' })
    y += lines.length * 11
  }
  y += 10

  const unit = (CONTENT + GAP) / 12
  for (const row of printRows(form)) {
    if (row[0].startsQuestions) y += 14
    // Measure the row first so it can move to the next page as a whole
    let x = margin
    const placed = row.map((question) => {
      const width = question.span * unit - GAP
      const field = { question, x, width, height: layoutField(doc, question, x, y, width, false) }
      x += question.span * unit
      return field
    })
    const rowHeight = Math.max(...placed.map((field) => field.height)) + 8
    if (y + rowHeight > PAGE.height - margin) {
      doc.addPage()
      y = margin
    }
    for (const field of placed) layoutField(doc, field.question, field.x, y, field.width, true)
    y += rowHeight
  }

  // Page numbers
  const pages = doc.getNumberOfPages()
  doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(120)
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page)
    doc.text(`Page ${page} of ${pages}`, PAGE.width - margin, PAGE.height - 20, { align: 'right' })
  }

  return doc
}

export async function exportFormPdf(form, fileName) {
  const doc = await buildFormPdf(form)
  doc.save(`${fileName}.pdf`)
}

// Blob URL of the PDF for the preview. Revoke it with URL.revokeObjectURL when closed.
export async function formPdfUrl(form) {
  return URL.createObjectURL((await buildFormPdf(form)).output('blob'))
}

// The printable form as a Blob (e.g. to preview a template)
export async function formPdfBlob(form) {
  return (await buildFormPdf(form)).output('blob')
}
