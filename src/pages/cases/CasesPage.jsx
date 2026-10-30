import { useState } from 'react'
import CaseFilters from '../../components/cases/CaseFilters'
import CasesTable from '../../components/cases/CasesTable'
import CaseModal from '../../components/cases/CaseModal'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'
import usePaginatedList from '../../hooks/usePaginatedList'
import { caseService } from '../../services/caseService'
import { CASE_COLUMNS } from '../../utils/caseHelpers'
import { exportAllRows } from '../../utils/export/exportAllRows'

function CasesPage() {
  const [filters, setFilters] = useState({ search: '', from: '', to: '', status: '' })
  // Filters and pages run on the backend
  const list = usePaginatedList(caseService, 'Case', filters)
  // undefined = closed, null = add, object = edit
  const [selected, setSelected] = useState(undefined)

  // Exports every case that matches the filters
  const handleExport = (format) =>
    exportAllRows(caseService, filters, format, { sheetName: 'Cases', columns: CASE_COLUMNS, fileName: 'cases' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Cases</h1>
        <p className="text-sm text-gray-500">Student cases and follow-ups.</p>
      </div>

      <Alert>{list.error}</Alert>

      <section className="rounded-xl bg-surface shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <CaseFilters filters={filters} onChange={setFilters} onAdd={() => setSelected(null)} onExport={handleExport} />
        </div>
        <CasesTable cases={list.items} loading={list.loading} onRowClick={setSelected} />
        <Pagination pagination={list.pagination} onPageChange={list.setPage} />
      </section>

      {selected !== undefined && (
        <CaseModal
          key={selected?.id ?? 'new'}
          caseItem={selected}
          onSave={list.saveItem}
          onDelete={list.removeItem}
          onClose={() => setSelected(undefined)}
        />
      )}
    </div>
  )
}

export default CasesPage
