import { THEME, TONES } from './exportTheme'

const rgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))

// Styled table only
export async function exportPdf({ columns, rows, fileName }) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const margin = 32

  autoTable(doc, {
    margin,
    head: [columns.map((column) => column.label.toUpperCase())],
    body: rows.map((row) => columns.map((column) => column.value(row))),
    theme: 'grid',
    // Wide tables continue on the next page, repeating the first column
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: 0,
    headStyles: { fillColor: rgb(THEME.blue), textColor: 255, fontSize: 7, halign: 'center', valign: 'middle' },
    styles: { fontSize: 7, cellPadding: 4, lineColor: rgb(THEME.border), lineWidth: 0.5, textColor: rgb(THEME.text) },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell: ({ section, column, row, cell }) => {
      if (section !== 'body') return
      const tone = TONES[columns[column.index].color?.(rows[row.index])]
      if (tone) {
        cell.styles.fillColor = rgb(tone.fill)
        cell.styles.textColor = rgb(tone.text)
        cell.styles.fontStyle = 'bold'
      }
    },
  })

  doc.save(`${fileName}.pdf`)
}
