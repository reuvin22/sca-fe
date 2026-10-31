import { THEME, TONES } from './exportTheme'
import { formatDate, toDateString } from '../dateHelpers'

const rgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))

// Printable report: a title, then one styled table per section.
// sections: [{ heading, columns, rows }] (columns as in exportTable)
export async function exportReportPdf({ title, subtitle, sections, fileName }) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const margin = 40

  doc
    .setFontSize(18)
    .setTextColor(...rgb(THEME.text))
    .text(title, margin, 56)
  doc
    .setFontSize(10)
    .setTextColor(107, 114, 128)
    .text(`${subtitle} · Generated ${formatDate(toDateString())}`, margin, 74)

  let y = 100
  for (const { heading, columns, rows } of sections) {
    // Start a new page when a heading would sit at the very bottom
    if (y > doc.internal.pageSize.getHeight() - 100) {
      doc.addPage()
      y = 56
    }
    doc
      .setFontSize(12)
      .setTextColor(...rgb(THEME.text))
      .text(heading, margin, y)
    autoTable(doc, {
      startY: y + 8,
      margin,
      head: [columns.map((column) => column.label.toUpperCase())],
      body: rows.length ? rows.map((row) => columns.map((column) => column.value(row))) : [['None']],
      theme: 'grid',
      headStyles: { fillColor: rgb(THEME.blue), textColor: 255, fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 4, lineColor: rgb(THEME.border), lineWidth: 0.5, textColor: rgb(THEME.text) },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didParseCell: ({ section, column, row, cell }) => {
        const tone = section === 'body' && rows.length && TONES[columns[column.index].color?.(rows[row.index])]
        if (tone) {
          cell.styles.fillColor = rgb(tone.fill)
          cell.styles.textColor = rgb(tone.text)
          cell.styles.fontStyle = 'bold'
        }
      },
    })
    y = doc.lastAutoTable.finalY + 28
  }

  doc.save(`${fileName}.pdf`)
}
