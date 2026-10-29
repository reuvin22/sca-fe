import { useState } from 'react'
import CaseFilters from '../../components/cases/CaseFilters'
import CasesTable from '../../components/cases/CasesTable'
import CaseModal from '../../components/cases/CaseModal'
import useCases from '../../hooks/useCases'
import { filterCases } from '../../utils/caseHelpers'

function CasesPage() {
  const { cases, loading, saveCase, removeCase } = useCases()
  const [filters, setFilters] = useState({ search: '', from: '', to: '', status: '' })
  // undefined = closed, null = add, object = edit
  const [selected, setSelected] = useState(undefined)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Cases</h1>
        <p className="text-sm text-gray-500">Student cases and follow-ups.</p>
      </div>

      <section className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <CaseFilters filters={filters} onChange={setFilters} onAdd={() => setSelected(null)} />
        </div>
        <CasesTable cases={filterCases(cases, filters)} loading={loading} onRowClick={setSelected} />
      </section>

      {selected !== undefined && (
        <CaseModal
          key={selected?.id ?? 'new'}
          caseItem={selected}
          onSave={saveCase}
          onDelete={removeCase}
          onClose={() => setSelected(undefined)}
        />
      )}
    </div>
  )
}

export default CasesPage
