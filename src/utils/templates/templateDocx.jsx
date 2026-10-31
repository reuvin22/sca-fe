import { saveFile } from '../export/exportTheme'
import { fillText } from './documentTemplates'

// The same template as an editable Word file (A4, 2.5 cm margins, Arial)
const CONTENT = 11906 - 1418 * 2 // A4 width minus margins, in twips
const BLANK = '____________________'

export async function downloadTemplateDocx(template, values, fileName) {
  const {
    AlignmentType,
    BorderStyle,
    Document,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableLayoutType,
    TableRow,
    TextRun,
    WidthType,
  } = await import('docx')

  const fill = (text) => fillText(text, values)
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none }
  const run = (text, options = {}) => new TextRun({ text, size: 22, ...options })
  const para = (children, options = {}) => new Paragraph({ children, spacing: { after: 120 }, ...options })
  const chunk = (items, size) =>
    Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size))

  // Borderless table: `rows` is a list of rows, each a list of cell paragraphs
  const grid = (rows, columns) => {
    const width = Math.floor(CONTENT / columns)
    return new Table({
      width: { size: width * columns, type: WidthType.DXA },
      columnWidths: Array(columns).fill(width),
      layout: TableLayoutType.FIXED,
      borders: noBorders,
      rows: rows.map(
        (cells) =>
          new TableRow({
            children: Array.from(
              { length: columns },
              (_, i) =>
                new TableCell({
                  width: { size: width, type: WidthType.DXA },
                  borders: noBorders,
                  children: cells[i] ?? [para([])],
                }),
            ),
          }),
      ),
    })
  }

  const body = []
  for (const block of template.blocks) {
    if (block.type === 'letterhead') {
      const lines = [
        ['Republic of the Philippines', 20],
        ['Department of Education', 24, true],
        [values.region, 20],
        [values.division, 20],
        [values.schoolName, 26, true],
      ].filter(([text]) => text?.trim())
      lines.forEach(([text, size, bold], i) =>
        body.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
            children: [run(text, { size, bold })],
            ...(i === lines.length - 1 && {
              border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '111827', space: 8 } },
            }),
          }),
        ),
      )
      body.push(para([], { spacing: { after: 240 } }))
    } else if (block.type === 'title') {
      body.push(
        para([run(fill(block.text).toUpperCase(), { size: 30, bold: true })], {
          alignment: AlignmentType.CENTER,
          spacing: { after: 280 },
        }),
      )
    } else if (block.type === 'heading') {
      body.push(para([run(fill(block.text), { size: 23, bold: true })], { spacing: { before: 160, after: 80 } }))
    } else if (block.type === 'paragraph') {
      body.push(
        para([run(fill(block.text))], { alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 320 } }),
      )
    } else if (block.type === 'note' || block.type === 'subtitle') {
      body.push(para([run(fill(block.text), { size: 18, italics: true, color: '4B5563' })]))
    } else if (block.type === 'spacer') {
      body.push(para([], { spacing: { after: (block.size ?? 12) * 20 } }))
    } else if (block.type === 'fields') {
      const rows = chunk(block.items, block.columns).map((row) =>
        row.map(([label, value]) => [para([run(`${label}: `, { bold: true }), run(value ? fill(value) : BLANK)])]),
      )
      body.push(grid(rows, block.columns), para([]))
    } else if (block.type === 'lines') {
      for (let i = 0; i < block.count; i++)
        body.push(para([run('_'.repeat(72), { color: '6B7280' })], { spacing: { after: 160 } }))
    } else if (block.type === 'checklist') {
      const rows = chunk(block.options, block.columns).map((row) =>
        row.map((option) => [para([run('☐  ', { font: 'Segoe UI Symbol' }), run(fill(option))])]),
      )
      body.push(grid(rows, block.columns), para([]))
    } else if (block.type === 'signatures') {
      body.push(para([], { spacing: { after: 480 } }))
      const signature = ([name, role]) => [
        para([run('______________________________')], { alignment: AlignmentType.CENTER, spacing: { after: 0 } }),
        para([run(fillText(name, values, ''), { bold: true })], {
          alignment: AlignmentType.CENTER,
          spacing: { after: 0 },
        }),
        para([run(fill(role), { size: 19, color: '4B5563' })], {
          alignment: AlignmentType.CENTER,
          spacing: { after: 360 },
        }),
      ]
      for (const row of chunk(block.items, 2)) {
        // One signature sits on the right; two share the row
        body.push(grid([row.length === 1 ? [null, signature(row[0])] : row.map(signature)], 2))
      }
    }
  }

  const doc = new Document({
    title: template.name,
    styles: { default: { document: { run: { font: 'Arial', size: 22 } } } },
    sections: [
      {
        properties: {
          page: { size: { width: 11906, height: 16838 }, margin: { top: 1418, bottom: 1418, left: 1418, right: 1418 } },
        },
        children: body,
      },
    ],
  })
  saveFile(await Packer.toBlob(doc), `${fileName}.docx`)
}
