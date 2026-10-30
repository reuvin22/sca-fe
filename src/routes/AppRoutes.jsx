import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import RequireAuth from '../components/common/RequireAuth'
import DashboardPage from '../pages/dashboard/DashboardPage'
import SettingsPage from '../pages/settings/SettingsPage'
import CasesPage from '../pages/cases/CasesPage'
import StudentsPage from '../pages/students/StudentsPage'
import AppointmentsPage from '../pages/appointments/AppointmentsPage'
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
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      {/* Default page */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
