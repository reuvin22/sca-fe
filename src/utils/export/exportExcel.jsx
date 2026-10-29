import { THEME, TONES, saveFile } from './exportTheme'

const fill = (color) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${color}` } })
const font = (color, extra = {}) => ({ name: 'Calibri', color: { argb: `FF${color}` }, ...extra })
const thin = { style: 'thin', color: { argb: `FF${THEME.border}` } }
const border = { top: thin, left: thin, bottom: thin, right: thin }

// Styled header row + data rows only
export async function exportExcel({ sheetName, columns, rows, fileName }) {
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet(sheetName)

  sheet.columns = columns.map((column) => ({ width: column.width ?? Math.max(14, column.label.length + 4) }))

  const header = sheet.getRow(1)
  header.values = columns.map((column) => column.label.toUpperCase())
  header.height = 32
  header.eachCell((cell) => {
    cell.fill = fill(THEME.blue)
    cell.font = font(THEME.white, { bold: true, size: 10 })
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    cell.border = border
  })

  rows.forEach((row, i) => {
    const excelRow = sheet.getRow(i + 2)
    excelRow.values = columns.map((column) => column.value(row))
    columns.forEach((column, c) => {
      const cell = excelRow.getCell(c + 1)
      const tone = TONES[column.color?.(row)]
      cell.border = border
      cell.alignment = { vertical: 'middle', wrapText: true }
      cell.font = font(tone?.text ?? THEME.text, { size: 10, bold: Boolean(tone) })
      if (tone) cell.fill = fill(tone.fill)
    })
  })

  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } }
  sheet.views = [{ state: 'frozen', ySplit: 1 }]

  const buffer = await workbook.xlsx.writeBuffer()
  saveFile(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${fileName}.xlsx`)
}
