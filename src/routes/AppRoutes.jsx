import { Suspense, lazy } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import RequireAuth from '../components/common/RequireAuth'
import RequireRole from '../components/common/RequireRole'
import Skeleton from '../components/ui/Skeleton'
import DevRegisterPage from '../pages/auth/DevRegisterPage'
import UpdateDetailPage from '../pages/updates/UpdateDetailPage'

// Developer pages load only when a developer opens them (the editor is large)
const DevReportsPage = lazy(() => import('../pages/dev/DevReportsPage'))
const DevUpdatesPage = lazy(() => import('../pages/dev/DevUpdatesPage'))
const DevTeamPage = lazy(() => import('../pages/dev/DevTeamPage'))
import DashboardPage from '../pages/dashboard/DashboardPage'
import SettingsPage from '../pages/settings/SettingsPage'
import CasesPage from '../pages/cases/CasesPage'
import StudentsPage from '../pages/students/StudentsPage'
import AppointmentsPage from '../pages/appointments/AppointmentsPage'
import ConsultationPage from '../pages/consultation/ConsultationPage'
import ReportsPage from '../pages/reports/ReportsPage'
import FilesPage from '../pages/files/FilesPage'
import TodoPage from '../pages/todo/TodoPage'
import ProfilePage from '../pages/profile/ProfilePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import CheckEmailPage from '../pages/auth/CheckEmailPage'
import VerifyEmailPage from '../pages/auth/VerifyEmailPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dev-register" element={<DevRegisterPage />} />
      </Route>
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Opened from a notification; not in the menu */}
        <Route path="/updates/:id" element={<UpdateDetailPage />} />

        {/* Developers only (the backend checks the role too) */}
        <Route
          path="/dev"
          element={
            <RequireRole roles={['dev']}>
              <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
                <Outlet />
              </Suspense>
            </RequireRole>
          }
        >
          <Route path="reports" element={<DevReportsPage />} />
          <Route path="updates" element={<DevUpdatesPage />} />
          <Route path="team" element={<DevTeamPage />} />
        </Route>
      </Route>
      {/* Default page */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
