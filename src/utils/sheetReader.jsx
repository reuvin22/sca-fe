// Reads CSV/Excel files into sheets for the preview: [{ name, rows: [['A1', 'B1'], ...] }]

// Splits CSV text into rows and cells. Handles quoted cells with commas, quotes and line breaks.
export function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (char === '"') quoted = false
      else cell += char
    } else if (char === '"') quoted = true
    else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (char !== '\r') cell += char
  }

  if (cell || row.length) rows.push([...row, cell])
  return rows
}

async function readCsv(url) {
  let text = await (await fetch(url)).text()
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1) // removes the BOM Excel adds to CSVs
  return [{ name: 'Sheet 1', rows: parseCsv(text) }]
}

// Only .xlsx is supported by exceljs (not the old .xls format)
async function readExcel(url) {
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(await (await fetch(url)).arrayBuffer())

  return workbook.worksheets.map((sheet) => {
    const rows = []
    sheet.eachRow({ includeEmpty: true }, (row) => {
      rows.push(Array.from({ length: row.cellCount }, (_, i) => row.getCell(i + 1).text))
    })
    return { name: sheet.name, rows }
  })
}

export const readSheets = (file, kind) => (kind === 'CSV' ? readCsv(file.url) : readExcel(file.url))
