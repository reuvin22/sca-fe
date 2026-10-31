import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, FileType, Sheet } from 'lucide-react'
import Button from '../ui/Button'

const FORMATS = [
  { value: 'pdf', label: 'PDF', icon: FileText },
  { value: 'word', label: 'Word (.docx)', icon: FileType },
  { value: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
  { value: 'csv', label: 'CSV', icon: Sheet },
]
const TABLE_FORMATS = ['pdf', 'excel', 'csv']

// Export button with a format menu. `onExport(format)` may be async.
// `only` picks the formats shown (tables: PDF, Excel, CSV; forms: PDF, Word).
function ExportMenu({ onExport, disabled, only = TABLE_FORMATS }) {
  const formats = FORMATS.filter((format) => only.includes(format.value))
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleExport = async (format) => {
    setOpen(false)
    setLoading(true)
    try {
      await onExport(format)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <Button variant="outline" fullWidth={false} loading={loading} disabled={disabled} onClick={() => setOpen(!open)}>
        {!loading && <Download size={16} />}
        Export
      </Button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-20" />
          <ul className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-gray-100 bg-surface py-1 shadow-lg">
            {formats.map(({ value, label, icon: Icon }) => (
              <li key={value}>
                <button
                  onClick={() => handleExport(value)}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Icon size={16} className="text-gray-400" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default ExportMenu
