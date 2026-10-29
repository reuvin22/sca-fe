import Card from '../ui/Card'
import DataTable from '../ui/DataTable'
import ExportMenu from '../common/ExportMenu'
import { WORKLOAD_COLUMNS } from '../../utils/reportHelpers'
import { exportTable } from '../../utils/export/exportTable'

function WorkloadCard({ rows }) {
  const handleExport = (format) =>
    exportTable(format, { sheetName: 'Workload by Counselor', columns: WORKLOAD_COLUMNS, rows, fileName: 'workload-by-counselor' })

  return (
    <Card title="Workload by Counselor" action={<ExportMenu onExport={handleExport} />}>
      <div className="-mx-5 -mb-5">
        <DataTable columns={WORKLOAD_COLUMNS} rows={rows} emptyText="No appointments yet." />
      </div>
    </Card>
  )
}

export default WorkloadCard
