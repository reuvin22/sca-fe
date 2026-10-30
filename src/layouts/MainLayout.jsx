import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      {/* On small screens the sidebar is hidden (opened with the burger menu), so the page uses the full width */}
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
