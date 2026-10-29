import { useEffect, useState } from 'react'
import Alert from '../ui/Alert'
import Skeleton from '../ui/Skeleton'
import { readSheets } from '../../utils/sheetReader'

const MAX_ROWS = 500 // keeps big files fast

// CSV/Excel shown as a table. Excel files with many sheets get tabs.
function SheetPreview({ file, kind }) {
  const [sheets, setSheets] = useState(null)
  const [error, setError] = useState('')
  const [active, setActive] = useState(0)

  useEffect(() => {
    let ignore = false
    readSheets(file, kind)
      .then((result) => !ignore && setSheets(result))
      .catch(() => !ignore && setError('This file could not be opened. Try downloading it instead.'))
    return () => {
      ignore = true
    }
  }, [file, kind])

  if (error) return <Alert>{error}</Alert>
  if (!sheets) return <Skeleton className="h-64" />

  const rows = sheets[active]?.rows ?? []
  const columnCount = Math.max(0, ...rows.map((row) => row.length))

  return (
    <div className="space-y-3">
      {sheets.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {sheets.map((sheet, i) => (
            <button
              key={sheet.name}
              type="button"
              onClick={() => setActive(i)}
              className={`cursor-pointer rounded-md px-3 py-1 text-xs ${i === active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}

      {rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">This sheet is empty.</p>
      ) : (
        <div className="max-h-[65vh] overflow-auto rounded-lg border border-gray-200">
          <table className="text-left text-xs text-gray-700">
            <tbody className="divide-y divide-gray-100">
              {rows.slice(0, MAX_ROWS).map((row, r) => (
                <tr key={r} className={r === 0 ? 'bg-gray-50 font-semibold text-gray-900' : ''}>
                  <td className="border-r border-gray-100 px-2 py-1.5 text-right text-gray-400">{r + 1}</td>
                  {Array.from({ length: columnCount }, (_, c) => (
                    <td key={c} className="border-r border-gray-100 px-3 py-1.5 whitespace-nowrap">
                      {row[c]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length > MAX_ROWS && (
        <p className="text-xs text-gray-400">Showing the first {MAX_ROWS} of {rows.length} rows. Download the file to see all.</p>
      )}
    </div>
  )
}

export default SheetPreview
