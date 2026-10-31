import { Line, Textbox } from 'fabric'
import { A4 } from '../pdfEditorHelpers'
import { fillText } from './documentTemplates'

// Lays a filled-in template out as PDF editor pages: every piece is a normal editable object
// (text boxes that wrap, lines), measured so text never overlaps and long documents continue on a new page.
const MARGIN = 56 // about 2 cm
const WIDTH = A4.width - MARGIN * 2
const FONT = 'Arial'
const TEXT = '#111827'
const MUTED = '#4b5563'

function textBox(
  text,
  { left = MARGIN, width = WIDTH, size = 11, bold, italic, align = 'left', color = TEXT, lineHeight = 1.3 },
) {
  return new Textbox(text, {
    originX: 'left',
    originY: 'top',
    left,
    width,
    fontFamily: FONT,
    fontSize: size,
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    textAlign: align,
    fill: color,
    lineHeight,
    splitByGrapheme: false,
  })
}

const rule = (x1, x2, y, width = 0.8) =>
  new Line([x1, y, x2, y], { stroke: TEXT, strokeWidth: width, originX: 'left', originY: 'top' })

// Places rows of objects top to bottom, starting a new page when a row doesn't fit
function pager() {
  const pages = [[]]
  let y = MARGIN
  return {
    // `objects` share one row; `height` is the row's height
    row(objects, height, gapAfter = 8) {
      if (y + height > A4.height - MARGIN && y > MARGIN) {
        pages.push([])
        y = MARGIN
      }
      for (const object of objects) {
        object.set({ top: y + (object.offsetY ?? 0) })
        pages.at(-1).push(object.toObject())
      }
      y += height + gapAfter
    },
    space: (size) => (y += size),
    pages,
  }
}

const cellWidth = (columns, gap = 18) => (WIDTH - gap * (columns - 1)) / columns
const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size))

// Returns { pages: [{ width, height, source }], objects: [[...]] } for the editor (see pagesFromProject)
export function layoutTemplate(template, values) {
  const fill = (text) => fillText(text, values)
  const page = pager()
  const add = (box, gapAfter) => page.row([box], box.height, gapAfter)

  for (const block of template.blocks) {
    if (block.type === 'letterhead') {
      const lines = [
        ['Republic of the Philippines', 10],
        ['Department of Education', 12, true],
        [values.region, 10],
        [values.division, 10],
        [values.schoolName, 13, true],
      ].filter(([text]) => text?.trim())
      lines.forEach(([text, size, bold]) => add(textBox(text, { size, bold, align: 'center' }), 1))
      page.space(6)
      page.row([rule(MARGIN, MARGIN + WIDTH, 0, 1.2)], 1, 16)
    } else if (block.type === 'title') {
      add(textBox(fill(block.text).toUpperCase(), { size: 15, bold: true, align: 'center' }), 14)
    } else if (block.type === 'heading') {
      page.space(4)
      add(textBox(fill(block.text), { size: 11.5, bold: true }), 6)
    } else if (block.type === 'paragraph') {
      // justify-left: lines fill the width except the last one, which stays left
      add(textBox(fill(block.text), { align: 'justify-left', lineHeight: 1.45 }), 10)
    } else if (block.type === 'note' || block.type === 'subtitle') {
      add(textBox(fill(block.text), { size: 9, italic: true, color: MUTED }), 10)
    } else if (block.type === 'spacer') {
      page.space(block.size ?? 12)
    } else if (block.type === 'fields') {
      const width = cellWidth(block.columns)
      for (const row of chunk(block.items, block.columns)) {
        const boxes = row.map(([label, value], i) =>
          textBox(`${label}: ${value ? fill(value) : '____________________'}`, {
            left: MARGIN + i * (width + 18),
            width,
          }),
        )
        page.row(boxes, Math.max(...boxes.map((box) => box.height)), 8)
      }
      page.space(4)
    } else if (block.type === 'lines') {
      for (let i = 0; i < block.count; i++) page.row([rule(MARGIN, MARGIN + WIDTH, 0)], 1, 20)
      page.space(4)
    } else if (block.type === 'checklist') {
      const width = cellWidth(block.columns)
      for (const row of chunk(block.options, block.columns)) {
        const boxes = row.map((option, i) => textBox(`☐  ${fill(option)}`, { left: MARGIN + i * (width + 18), width }))
        page.row(boxes, Math.max(...boxes.map((box) => box.height)), 6)
      }
      page.space(6)
    } else if (block.type === 'signatures') {
      page.space(28)
      const width = 200
      for (const row of chunk(block.items, 2)) {
        // One signature sits on the right; two share the row
        const lefts = row.length === 1 ? [MARGIN + WIDTH - width] : [MARGIN, MARGIN + WIDTH - width]
        const objects = row.flatMap(([name, role], i) => {
          const left = lefts[i]
          // An empty name leaves just the line to sign on
          const nameBox = textBox(fillText(name, values, ''), { left, width, bold: true, align: 'center' })
          const roleBox = textBox(fill(role), { left, width, size: 9.5, align: 'center', color: MUTED })
          nameBox.offsetY = 4
          roleBox.offsetY = 4 + nameBox.height
          return [rule(left, left + width, 0), nameBox, roleBox]
        })
        page.row(objects, 44, 26)
      }
    }
  }

  return {
    version: 1,
    pages: page.pages.map(() => ({ width: A4.width, height: A4.height, source: null })),
    objects: page.pages,
  }
}
