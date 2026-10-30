// Backend endpoint paths (relative to VITE_API_BASE_URL)
export const AUTH_ROUTES = {
  register: '/auth/register',
  login: '/auth/login',
  google: '/auth/google',
  me: '/auth/me',
  resendConfirmation: '/auth/resend-confirmation',
  verifyEmail: '/auth/verify-email',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
}

export const PROFILE_ROUTE = '/profile'
export const PROFILE_PHOTO_ROUTE = '/profile/photo'
export const STUDENTS_ROUTE = '/students'
export const CASES_ROUTE = '/cases'
export const APPOINTMENTS_ROUTE = '/appointments'
export const CATEGORIES_ROUTE = '/categories'
export const FILES_ROUTE = '/files'
export const TODO_BOARD_ROUTE = '/todo/board'
export const SUPPORT_ROUTE = '/support'

export const REPORT_ROUTES = {
  dashboard: '/reports/dashboard',
  summary: '/reports/summary',
  notifications: '/reports/notifications',
}
