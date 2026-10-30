import { useState } from 'react'
import ReportColumn from '../../components/dev/ReportColumn'
import ReportModal from '../../components/dev/ReportModal'
import Alert from '../../components/ui/Alert'
import Skeleton from '../../components/ui/Skeleton'
import useFetch from '../../hooks/useFetch'
import useReportBoard from '../../hooks/useReportBoard'
import { getTeam } from '../../services/teamService'
import { REPORT_COLUMNS, REPORT_TABS } from '../../utils/reportBoardHelpers'

// Developers: Contact Support messages as a Kanban board, one tab for bugs and one for feature requests
function DevReportsPage() {
  const [type, setType] = useState('bug')
  const { reports, loading, error, changeReport, moveReport } = useReportBoard(type)
  const team = useFetch(getTeam)
  const [openId, setOpenId] = useState(null)
  const opened = reports.find((report) => report.id === openId)

  return (
    <div className="flex h-[calc(100dvh-6rem)] min-h-120 flex-col gap-6 sm:h-[calc(100dvh-7rem)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">Messages from Contact Support. Drag cards to update their progress.</p>
        </div>
        <div className="flex rounded-lg border border-gray-200 bg-surface p-1" role="tablist">
          {REPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={type === tab.id}
              onClick={() => setType(tab.id)}
              className={`cursor-pointer rounded-md px-3 py-1 text-sm ${type === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Alert>{error}</Alert>

      <section className="flex min-h-0 flex-1 gap-4 overflow-x-auto rounded-xl bg-surface p-4 shadow-sm">
        {loading
          ? REPORT_COLUMNS.map((column) => <Skeleton key={column.id} className="h-full w-72 shrink-0 rounded-md" />)
          : REPORT_COLUMNS.map((column) => (
              <ReportColumn
                key={column.id}
                column={column}
                reports={reports.filter((report) => report.status === column.id)}
                onOpen={(report) => setOpenId(report.id)}
                onDropReport={moveReport}
              />
            ))}
      </section>

      {opened && <ReportModal report={opened} team={team.data ?? []} onChange={changeReport} onClose={() => setOpenId(null)} />}
    </div>
  )
}

export default DevReportsPage
