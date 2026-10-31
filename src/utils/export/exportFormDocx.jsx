import { saveFile } from './exportTheme'
import { fieldLabel, printRows } from '../formBuilderHelpers'
import { encodeForm } from '../formPayload'

// Editable Word (.docx) version of the printable form. Same layout as exportFormPdf:
// each printed row is a borderless table, blanks are cells with a bottom border.
const CONTENT = 9638 // A4 width minus 2 cm margins, in twips
const LABEL_SIZE = 17 // half-points (8.5 pt)
const PART_SIZE = 13

export async function exportFormDocx(form, fileName) {
  const {
    AlignmentType,
    BorderStyle,
    HeightRule,
    Document,
    Packer,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableLayoutType,
    TableRow,
    TextRun,
    VerticalAlign,
    WidthType,
  } = await import('docx')

  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none }
  const underline = {
    top: none,
    left: none,
    right: none,
    bottom: { style: BorderStyle.SINGLE, size: 6, color: '404040' },
  }
  const width = (size) => ({ size, type: WidthType.DXA })

  const label = (question) => new TextRun({ text: fieldLabel(question), bold: true, size: LABEL_SIZE })
  const cell = (children, size, borders = { top: none, bottom: none, left: none, right: none }) =>
    new TableCell({ children, width: width(size), borders, verticalAlign: VerticalAlign.BOTTOM })
  const table = (rows, columnWidths) =>
    new Table({
      rows,
      columnWidths,
      width: width(columnWidths.reduce((a, b) => a + b, 0)),
      layout: TableLayoutType.FIXED,
      borders: noBorders,
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    })
  const GAP = 160 // space between blanks so they don't join into one line
  // Bottom-bordered cells with a gap cell between each (Word joins touching borders)
  const blankCells = (widths) =>
    widths.flatMap((size, i) => [
      ...(i ? [cell([new Paragraph({})], GAP)] : []),
      cell([new Paragraph({ spacing: { before: 120 } })], size, underline),
    ])
  const blankRow = (widths, height) =>
    new TableRow({ height: { value: height, rule: HeightRule.ATLEAST }, children: blankCells(widths) })
  const withGaps = (widths) => widths.flatMap((size, i) => (i ? [GAP, size] : [size]))

  // About how wide the bold uppercase label is (twips), so the blank fills the rest
  const labelWidth = (question) => Math.min(fieldLabel(question).length * 112 + 160, 6000)

  function field(question, size) {
    if (question.type === 'section') {
      return [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          shading: { type: ShadingType.CLEAR, fill: 'DCE6F2', color: 'auto' },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: '7890AA' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: '7890AA' },
            left: { style: BorderStyle.SINGLE, size: 6, color: '7890AA' },
            right: { style: BorderStyle.SINGLE, size: 6, color: '7890AA' },
          },
          spacing: { before: 120, after: 120 },
          children: [new TextRun({ text: question.label.toUpperCase(), bold: true, size: 19 })],
        }),
      ]
    }

    // Numbered questions always put the answer below the question
    const stacked = Boolean(question.number) || labelWidth(question) > size * 0.7
    // Space above numbered questions so they don't crowd the one before
    const labelParagraph = new Paragraph({
      spacing: { before: question.number ? 160 : 0 },
      children: [label(question)],
    })

    if (question.type === 'textarea') {
      // A table, not bordered paragraphs: Word merges touching paragraph borders into one box
      return [
        labelParagraph,
        table(
          [1, 2, 3].map(() => blankRow([size], 360)),
          [size],
        ),
      ]
    }

    if (['radio', 'checkbox', 'select'].includes(question.type)) {
      const mark = question.type === 'checkbox' ? '☐' : '○'
      const choice = (option) => [
        new TextRun({ text: `${mark} `, font: 'Segoe UI Symbol', size: LABEL_SIZE }),
        new TextRun({ text: option, size: LABEL_SIZE }),
      ]
      if (question.layout === 'grid') {
        const columnWidth = Math.floor(size / question.columns)
        const rows = []
        for (let i = 0; i < question.options.length; i += question.columns) {
          const options = question.options.slice(i, i + question.columns)
          rows.push(
            new TableRow({
              children: Array.from({ length: question.columns }, (_, c) =>
                cell([new Paragraph({ children: options[c] ? choice(options[c]) : [] })], columnWidth),
              ),
            }),
          )
        }
        return [labelParagraph, table(rows, Array(question.columns).fill(columnWidth))]
      }
      // In a row: the choices wrap like text, after the label (header) or on the next line (questions)
      const choices = question.options.flatMap((option) => [...choice(option), new TextRun({ text: '     ' })])
      if (question.number) return [labelParagraph, new Paragraph({ children: choices })]
      return [new Paragraph({ children: [label(question), new TextRun({ text: '  ' }), ...choices] })]
    }

    // Short answers: label + one blank, or labeled parts side by side with small labels under them
    const parts = question.type === 'text' && question.parts.length ? question.parts : ['']
    const labelSize = stacked ? 0 : labelWidth(question)
    const partWidth = Math.floor((size - labelSize - GAP * (parts.length - 1)) / parts.length)
    const partWidths = parts.map(() => partWidth)
    const widths = [...(stacked ? [] : [labelSize]), ...withGaps(partWidths)]
    const blanks = blankCells(partWidths)
    const rows = [
      new TableRow({
        children: [
          ...(stacked
            ? []
            : [cell([new Paragraph({ spacing: { before: 120 }, children: [label(question)] })], labelSize)]),
          ...blanks,
        ],
      }),
    ]
    if (parts[0]) {
      rows.push(
        new TableRow({
          children: [
            ...(stacked ? [] : [cell([new Paragraph({})], labelSize)]),
            ...parts.flatMap((part, i) => [
              ...(i ? [cell([new Paragraph({})], GAP)] : []),
              cell(
                [new Paragraph({ children: [new TextRun({ text: part, size: PART_SIZE, color: '595959' })] })],
                partWidth,
              ),
            ]),
          ],
        }),
      )
    }
    return [...(stacked ? [labelParagraph] : []), table(rows, widths)]
  }

  // One borderless table per printed row; each field gets its share of the 12 columns
  const unit = CONTENT / 12
  const body = printRows(form).flatMap((row) => {
    const widths = row.map((question) => Math.floor(question.span * unit))
    const cells = row.map((question, i) =>
      cell([...field(question, widths[i] - GAP), new Paragraph({ spacing: { after: 160 } })], widths[i]),
    )
    const spaceBefore = row[0].startsQuestions ? [new Paragraph({ spacing: { after: 200 } })] : []
    return [...spaceBefore, table([new TableRow({ children: cells })], widths)]
  })

  const doc = new Document({
    title: form.title,
    // The form itself, so importing this file restores it exactly
    customProperties: [{ name: 'sca-form', value: encodeForm(form) }],
    styles: { default: { document: { run: { font: 'Arial', size: LABEL_SIZE } } } },
    sections: [
      {
        properties: {
          page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: form.description ? 60 : 240 },
            children: [new TextRun({ text: form.title.toUpperCase(), bold: true, size: 30 })],
          }),
          ...(form.description
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 240 },
                  children: [new TextRun({ text: form.description, size: 18, color: '595959' })],
                }),
              ]
            : []),
          ...body,
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveFile(blob, `${fileName}.docx`)
}
