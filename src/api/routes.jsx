// Backend endpoint paths (relative to VITE_API_BASE_URL)
export const AUTH_ROUTES = {
  register: '/auth/register',
  login: '/auth/login',
  loginVerify: '/auth/login/verify',
  loginResend: '/auth/login/resend',
  logout: '/auth/logout',
  logoutAll: '/auth/logout-all',
  google: '/auth/google',
  me: '/auth/me',
  resendConfirmation: '/auth/resend-confirmation',
  verifyEmail: '/auth/verify-email',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  invitation: (token) => `/auth/invitations/${token}`,
  registerDeveloper: '/auth/register-developer',
  acceptInvitation: '/auth/accept-invitation',
}

export const PROFILE_ROUTE = '/profile'
export const PROFILE_PHOTO_ROUTE = '/profile/photo'
export const ACTIVITY_ROUTE = '/profile/activity'
export const STUDENTS_ROUTE = '/students'
export const FORMS_ROUTE = '/forms'
export const PUBLIC_FORMS_ROUTE = '/public/forms'
export const CASES_ROUTE = '/cases'
export const APPOINTMENTS_ROUTE = '/appointments'
export const CATEGORIES_ROUTE = '/categories'
export const FILES_ROUTE = '/files'
export const TODO_BOARD_ROUTE = '/todo/board'
export const SUPPORT_ROUTE = '/support'
export const FEATURES_ROUTE = '/features'
export const TEAM_ROUTE = '/team'
export const UPDATES_ROUTE = '/updates'

export const REPORT_ROUTES = {
  dashboard: '/reports/dashboard',
  summary: '/reports/summary',
  period: '/reports/period',
  notifications: '/reports/notifications',
}
