import { saveFile } from './exportTheme'

const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`

// Header row + data rows only
export function exportCsv({ columns, rows, fileName }) {
  const lines = [columns.map((column) => column.label), ...rows.map((row) => columns.map((column) => column.value(row)))]
  const csv = lines.map((line) => line.map(escape).join(',')).join('\r\n')
  // BOM so Excel reads special characters correctly
  saveFile(new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' }), `${fileName}.csv`)
}
