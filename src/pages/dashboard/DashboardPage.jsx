import { useState } from 'react'
import { toast } from 'react-toastify'
import Alert from '../../components/ui/Alert'
import CaseStats from '../../components/dashboard/CaseStats'
import ProgressCard from '../../components/dashboard/ProgressCard'
import CaseChartCard from '../../components/dashboard/CaseChartCard'
import AreaChartCard from '../../components/dashboard/AreaChartCard'
import BarListCard from '../../components/dashboard/BarListCard'
import CalendarCard from '../../components/dashboard/CalendarCard'
import EventCards from '../../components/dashboard/EventCards'
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton'
import CaseModal from '../../components/cases/CaseModal'
import useFetch from '../../hooks/useFetch'
import useRequest from '../../hooks/useRequest'
import { caseService } from '../../services/caseService'
import { getDashboard } from '../../services/reportService'
import { getDashboardData } from '../../utils/dashboardHelpers'

function DashboardPage() {
  const { data, loading, error, reload } = useFetch(getDashboard)
  const [selected, setSelected] = useState(null)
  // The follow-up cards only have a summary, so the full case is loaded before editing
  const openCase = useRequest(async (item) => setSelected(await caseService.get(item.id)))

  // After a change in the modal, reload the dashboard so every chart updates
  const handleSave = async (form) => {
    await caseService.update(form)
    toast.success('Case updated')
    reload()
  }

  const handleDelete = async (id) => {
    await caseService.remove(id)
    toast.success('Case deleted')
    reload()
  }

  if (loading) return <DashboardSkeleton />
  if (error) return <Alert>{error}</Alert>

  const dashboard = getDashboardData(data)

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        <CaseStats stats={dashboard.stats} />

        <div className="grid gap-6 lg:grid-cols-2">
          <ProgressCard items={dashboard.progress} />
          <CaseChartCard {...dashboard.cases} />
          <AreaChartCard {...dashboard.weekly} />
          <BarListCard {...dashboard.concerns} />
        </div>
      </div>

      <div className="grid content-start gap-6 md:grid-cols-2 xl:grid-cols-1">
        <CalendarCard />
        <Alert>{openCase.error}</Alert>
        <EventCards events={dashboard.upcoming} onSelect={openCase.run} />
      </div>

      {selected && (
        <CaseModal key={selected.id} caseItem={selected} onSave={handleSave} onDelete={handleDelete} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

export default DashboardPage
