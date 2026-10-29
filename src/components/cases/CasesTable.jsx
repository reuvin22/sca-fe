import DataTable from '../ui/DataTable'
import FollowUpBadge from './FollowUpBadge'
import { CASE_COLUMNS, getCaseStatus } from '../../utils/caseHelpers'

// Screen-only styling for some columns
const renders = {
  caseNumber: { render: (item) => <span className="font-medium text-gray-900">{item.caseNumber}</span> },
  remarks: { className: 'max-w-xs', render: (item) => <p className="line-clamp-2">{item.remarks}</p> },
  status: { render: (item) => <FollowUpBadge status={getCaseStatus(item)} /> },
}

const columns = CASE_COLUMNS.map((column) => ({ ...column, ...renders[column.id] }))

function CasesTable({ cases, loading, onRowClick }) {
  return <DataTable columns={columns} rows={cases} loading={loading} onRowClick={onRowClick} emptyText="No cases found." />
}

export default CasesTable
