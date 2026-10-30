// Register and email confirmation use the backend. The rest are still mocks until connected.
import api from '../api/axios'
import { AUTH_ROUTES } from '../api/routes'
import { saveToken } from '../utils/authStorage'

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

// `data`: { fullName, email, password }. Sends the confirmation email.
export function register({ fullName, email, password }) {
  return api.post(AUTH_ROUTES.register, { fullName, email, password })
}

export function resendConfirmation(email) {
  return api.post(AUTH_ROUTES.resendConfirmation, { email })
}

// Confirms the email from the private link and signs the user in.
// Returns { token, profile }; save it to the store with signIn().
export async function verifyEmail(token) {
  if (!token) throw new Error('This confirmation link is invalid or has expired.')
  const session = await api.post(AUTH_ROUTES.verifyEmail, { token })
  saveToken(session.token)
  return session
}

export async function forgotPassword(email) {
  await delay()
  return { email }
}

export async function resetPassword(token, password) {
  await delay()
  if (!token || !password) throw new Error('This reset link is invalid or has expired.')
}

// `profile`: { user, school }
export async function updateProfile(profile) {
  await delay()
  return profile
}
