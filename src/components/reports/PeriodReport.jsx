import { useState } from 'react'
import { BarChart3, Printer } from 'lucide-react'
import Alert from '../ui/Alert'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Card from '../ui/Card'
import DataTable from '../ui/DataTable'
import Select from '../ui/Select'
import Skeleton from '../ui/Skeleton'
import ExportMenu from '../common/ExportMenu'
import CountBarsCard from './CountBarsCard'
import usePeriodReport from '../../hooks/usePeriodReport'
import { FOLLOW_UP } from '../../utils/caseHelpers'
import { exportTable } from '../../utils/export/exportTable'
import { exportReportPdf } from '../../utils/export/exportReportPdf'
import {
  DUE_CASE_COLUMNS,
  MONTH_OPTIONS,
  SUMMARY_COLUMNS,
  YEAR_OPTIONS,
  caseTotals,
  countSections,
  periodLabel,
  toSummaryRows,
} from '../../utils/periodReportHelpers'

const TYPE_OPTIONS = [
  { value: 'month', label: 'Monthly' },
  { value: 'year', label: 'Annual' },
]

// The table shows the status as a badge; exports use the plain text column
const DUE_TABLE_COLUMNS = DUE_CASE_COLUMNS.map((column) =>
  column.id === 'status'
    ? { ...column, render: (row) => <Badge label={column.value(row)} className={FOLLOW_UP[row.status]?.className} /> }
    : column,
)

// Monthly / annual summary of cases and the follow-up due dates in that period
function PeriodReport() {
  const today = new Date()
  const [type, setType] = useState('month')
  const [year, setYear] = useState(String(today.getFullYear()))
  const [month, setMonth] = useState(String(today.getMonth() + 1))
  const monthNumber = type === 'month' ? Number(month) : undefined
  const { report, refreshing, error } = usePeriodReport(Number(year), monthNumber)

  const label = periodLabel(year, monthNumber)
  const fileName = `${type === 'month' ? 'monthly' : 'annual'}-report-${year}${monthNumber ? `-${month.padStart(2, '0')}` : ''}`

  const exportSummary = (format) =>
    exportTable(format, { sheetName: 'Summary', columns: SUMMARY_COLUMNS, rows: toSummaryRows(report), fileName })
  const exportDueCases = (format) =>
    exportTable(format, {
      sheetName: 'Due Dates',
      columns: DUE_CASE_COLUMNS,
      rows: report.dueCases,
      fileName: `${fileName}-due-dates`,
    })
  const printReport = () =>
    exportReportPdf({
      title: `${type === 'month' ? 'Monthly' : 'Annual'} Case Report`,
      subtitle: label,
      fileName,
      sections: [
        { heading: 'Summary', columns: SUMMARY_COLUMNS, rows: toSummaryRows(report) },
        { heading: 'Follow-up Due Dates', columns: DUE_CASE_COLUMNS, rows: report.dueCases },
      ],
    })

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Monthly / Annual Report</h2>
          <p className="text-sm text-gray-500">Cases by intake date and follow-ups due in {label}.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-end">
          <Select id="reportType" options={TYPE_OPTIONS} value={type} onChange={(e) => setType(e.target.value)} />
          {type === 'month' && (
            <Select id="reportMonth" options={MONTH_OPTIONS} value={month} onChange={(e) => setMonth(e.target.value)} />
          )}
          <Select id="reportYear" options={YEAR_OPTIONS} value={year} onChange={(e) => setYear(e.target.value)} />
          <Button variant="outline" fullWidth={false} disabled={!report} onClick={printReport}>
            <Printer size={16} />
            Print report
          </Button>
        </div>
      </div>

      <Alert>{error}</Alert>

      {!report && refreshing && <Skeleton className="h-64 rounded-xl" />}

      {report && (
        <div className={`space-y-6 transition-opacity ${refreshing ? 'opacity-60' : ''}`}>
          <Card title={`Summary · ${label}`} action={<ExportMenu onExport={exportSummary} />}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
              {caseTotals(report).map(({ label: name, value }) => (
                <div key={name} className="rounded-lg bg-page p-3">
                  <p className="text-xs text-gray-500">{name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {countSections(report).map(({ title, bars }) => (
              <CountBarsCard
                key={title}
                title={title}
                icon={BarChart3}
                bars={bars}
                emptyText="No cases in this period."
              />
            ))}
          </div>

          <Card title={`Follow-up Due Dates · ${label}`} action={<ExportMenu onExport={exportDueCases} />}>
            <div className="-mx-5 -mb-5">
              <DataTable
                columns={DUE_TABLE_COLUMNS}
                rows={report.dueCases}
                emptyText="No follow-ups due in this period."
              />
            </div>
          </Card>
        </div>
      )}
    </section>
  )
}

export default PeriodReport
