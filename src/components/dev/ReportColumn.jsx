import { useState } from 'react'
import ReportCard from './ReportCard'

// One Kanban column. Dropping a card here moves the report to this status.
function ReportColumn({ column, reports, onOpen, onDropReport }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    onDropReport(e.dataTransfer.getData('text/plain'), column.id)
  }

  // Ignores leaving into the column's own children
  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false)
  }

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex w-72 shrink-0 flex-col rounded-md p-2 transition ${dragOver ? 'bg-brand-50' : 'bg-gray-100'}`}
    >
      <header className="flex items-center gap-2 px-2 pt-1 pb-3">
        <h2 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">{column.title}</h2>
        <span className="text-xs text-gray-500">{reports.length}</span>
      </header>
      {/* Cards scroll inside the column when they don't fit */}
      <div className="flex min-h-0 flex-col gap-1.5 overflow-y-auto">
        {reports.length === 0 && <p className="px-2 py-4 text-center text-xs text-gray-400">Nothing here</p>}
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}

export default ReportColumn
