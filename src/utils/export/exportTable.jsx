import { exportCsv } from './exportCsv'
import { toDateString } from '../dateHelpers'

// Exports only the table (header + rows).
// options: { sheetName, fileName, rows, columns: [{ label, value: (row) => text, color?: (row) => tone, width? }] }
// Excel and PDF libraries load only when used.
export async function exportTable(format, options) {
  const data = { ...options, fileName: `${options.fileName}-${toDateString()}` }

  if (format === 'csv') return exportCsv(data)
  if (format === 'excel') return (await import('./exportExcel')).exportExcel(data)
  if (format === 'pdf') return (await import('./exportPdf')).exportPdf(data)
}
