import { toast } from 'react-toastify'
import { exportTable } from './exportTable'

// Exports every row that matches the filters (all pages, not just the one on screen).
// options: same as exportTable, without `rows`.
export async function exportAllRows(service, filters, format, options) {
  try {
    const rows = await service.listAll(filters)
    await exportTable(format, { ...options, rows })
  } catch (error) {
    toast.error(error.message || 'Could not export. Please try again.')
  }
}
