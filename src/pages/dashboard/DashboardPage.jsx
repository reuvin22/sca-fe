import Alert from '../../components/ui/Alert'
import CaseStats from '../../components/dashboard/CaseStats'
import ProgressCard from '../../components/dashboard/ProgressCard'
import MonthlyChartCard from '../../components/dashboard/MonthlyChartCard'
import AreaChartCard from '../../components/dashboard/AreaChartCard'
import BarListCard from '../../components/dashboard/BarListCard'
import CalendarCard from '../../components/dashboard/CalendarCard'
import EventCards from '../../components/dashboard/EventCards'
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton'
import { useState } from 'react'
import CaseModal from '../../components/cases/CaseModal'
import useCrud from '../../hooks/useCrud'
import { caseService } from '../../services/caseService'
import { getDashboardData } from '../../utils/dashboardHelpers'

function DashboardPage() {
  // useCrud so edits from the follow-up modal update every chart
  const { items: cases, loading, error, saveItem, removeItem } = useCrud(caseService, 'Case')
  const [selected, setSelected] = useState(null)

  if (loading) return <DashboardSkeleton />
  if (error) return <Alert>{error}</Alert>

  const data = getDashboardData(cases)

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        <CaseStats cases={cases} />

        <div className="grid gap-6 lg:grid-cols-2">
          <ProgressCard items={data.progress} />
          <MonthlyChartCard months={data.monthly} />
          <AreaChartCard {...data.weekly} />
          <BarListCard {...data.concerns} />
        </div>
      </div>

      <div className="grid content-start gap-6 md:grid-cols-2 xl:grid-cols-1">
        <CalendarCard />
        <EventCards events={data.upcoming} onSelect={setSelected} />
      </div>

      {selected && (
        <CaseModal key={selected.id} caseItem={selected} onSave={saveItem} onDelete={removeItem} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

export default DashboardPage
