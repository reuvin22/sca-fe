import { Suspense, lazy } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import RequireAuth from '../components/common/RequireAuth'
import RequireRole from '../components/common/RequireRole'
import Skeleton from '../components/ui/Skeleton'
import DevRegisterPage from '../pages/auth/DevRegisterPage'
import UpdateDetailPage from '../pages/updates/UpdateDetailPage'
import FeatureRequestsPage from '../pages/features/FeatureRequestsPage'

// Developer pages load only when a developer opens them (the editor is large)
const DevReportsPage = lazy(() => import('../pages/dev/DevReportsPage'))
const DevUpdatesPage = lazy(() => import('../pages/dev/DevUpdatesPage'))
const DevTeamPage = lazy(() => import('../pages/dev/DevTeamPage'))
const DevFeatureReviewPage = lazy(() => import('../pages/dev/DevFeatureReviewPage'))
import DashboardPage from '../pages/dashboard/DashboardPage'
import SettingsPage from '../pages/settings/SettingsPage'
import CasesPage from '../pages/cases/CasesPage'
import StudentsPage from '../pages/students/StudentsPage'
import FormsPage from '../pages/forms/FormsPage'
import FormBuilderPage from '../pages/forms/FormBuilderPage'
import PublicFormPage from '../pages/forms/PublicFormPage'
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
      {/* Public answer link: no sign-in */}
      <Route path="/f/:code" element={<PublicFormPage />} />
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
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/forms/new" element={<FormBuilderPage />} />
        <Route path="/forms/:id/edit" element={<FormBuilderPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Opened from a notification; not in the menu */}
        <Route path="/updates/:id" element={<UpdateDetailPage />} />
        {/* Opened from the navbar, beside Contact Support */}
        <Route path="/feature-requests" element={<FeatureRequestsPage />} />

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
          <Route path="feature-review" element={<DevFeatureReviewPage />} />
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
