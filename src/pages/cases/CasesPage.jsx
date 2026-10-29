import { useState } from 'react'
import CaseFilters from '../../components/cases/CaseFilters'
import CasesTable from '../../components/cases/CasesTable'
import CaseModal from '../../components/cases/CaseModal'
import useCrud from '../../hooks/useCrud'
import { caseService } from '../../services/caseService'
import { CASE_COLUMNS, filterCases } from '../../utils/caseHelpers'
import { exportTable } from '../../utils/export/exportTable'

function CasesPage() {
  const { items: cases, loading, saveItem, removeItem } = useCrud(caseService, 'Case')
  const [filters, setFilters] = useState({ search: '', from: '', to: '', status: '' })
  // undefined = closed, null = add, object = edit
  const [selected, setSelected] = useState(undefined)
  const visibleCases = filterCases(cases, filters)

  // Exports only the rows shown after filtering
  const handleExport = (format) =>
    exportTable(format, {
      sheetName: 'Cases',
      columns: CASE_COLUMNS,
      rows: visibleCases,
      fileName: 'cases',
    })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Cases</h1>
        <p className="text-sm text-gray-500">Student cases and follow-ups.</p>
      </div>

      <section className="rounded-xl bg-surface shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <CaseFilters filters={filters} onChange={setFilters} onAdd={() => setSelected(null)} onExport={handleExport} />
        </div>
        <CasesTable cases={visibleCases} loading={loading} onRowClick={setSelected} />
      </section>

      {selected !== undefined && (
        <CaseModal
          key={selected?.id ?? 'new'}
          caseItem={selected}
          onSave={saveItem}
          onDelete={removeItem}
          onClose={() => setSelected(undefined)}
        />
      )}
    </div>
  )
}

export default CasesPage
