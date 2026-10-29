import Alert from '../../components/ui/Alert'
import StatCard from '../../components/dashboard/StatCard'
import ProgressCard from '../../components/dashboard/ProgressCard'
import MonthlyChartCard from '../../components/dashboard/MonthlyChartCard'
import AreaChartCard from '../../components/dashboard/AreaChartCard'
import BarListCard from '../../components/dashboard/BarListCard'
import CalendarCard from '../../components/dashboard/CalendarCard'
import EventCards from '../../components/dashboard/EventCards'
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton'
import useFetch from '../../hooks/useFetch'
import { getDashboard } from '../../services/dashboardService'

function DashboardPage() {
  const { data, loading, error } = useFetch(getDashboard)

  if (loading) return <DashboardSkeleton />
  if (error) return <Alert>{error}</Alert>

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ProgressCard items={data.progress} />
          <MonthlyChartCard months={data.monthly} />
          <AreaChartCard {...data.sessions} />
          <BarListCard {...data.concerns} />
        </div>
      </div>

      <div className="grid content-start gap-6 md:grid-cols-2 xl:grid-cols-1">
        <CalendarCard />
        <EventCards appointment={data.nextAppointment} />
      </div>
    </div>
  )
}

export default DashboardPage
