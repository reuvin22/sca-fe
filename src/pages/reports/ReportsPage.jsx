import { CircleCheck, Share2 } from 'lucide-react'
import Alert from '../../components/ui/Alert'
import Skeleton from '../../components/ui/Skeleton'
import ProgressCard from '../../components/dashboard/ProgressCard'
import MonthlyChartCard from '../../components/dashboard/MonthlyChartCard'
import CountBarsCard from '../../components/reports/CountBarsCard'
import WorkloadCard from '../../components/reports/WorkloadCard'
import useFetch from '../../hooks/useFetch'
import { getReportSummary } from '../../services/reportService'
import { getReportData } from '../../utils/reportHelpers'

function ReportsPage() {
  const { data: summary, loading, error } = useFetch(getReportSummary)
  const data = summary && getReportData(summary)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">Service demand and staff workload.</p>
      </div>

      <Alert>{error && 'Could not load reports. Please try again.'}</Alert>

      {loading && (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <ProgressCard title="Rates" items={data.rates} />
            <MonthlyChartCard title="Appointments by Month" months={data.appointmentsByMonth} />
            <CountBarsCard title="Completed vs Pending Cases" icon={CircleCheck} bars={data.caseStatus} />
            <CountBarsCard title="Referrals by Category" icon={Share2} bars={data.referrals} emptyText="No referrals yet." />
          </div>
          <WorkloadCard rows={data.workload} />
        </>
      )}
    </div>
  )
}

export default ReportsPage
