import { signInWithPopup, signOut } from 'firebase/auth'
import api from '../api/axios'
import { firebaseAuth, googleProvider } from '../api/firebase'
import { AUTH_ROUTES, PROFILE_PHOTO_ROUTE, PROFILE_ROUTE } from '../api/routes'
import { clearToken, saveToken } from '../utils/authStorage'

// Sign-in calls return { token, profile } and save the token. Put it in the store with signIn().
async function startSession(request) {
  const session = (await request).data
  saveToken(session.token)
  return session
}

export function login({ email, password }) {
  return startSession(api.post(AUTH_ROUTES.login, { email, password }))
}

// Google sign-in runs in a Firebase popup. The backend checks the Google ID token.
export async function loginWithGoogle() {
  let idToken
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider)
    idToken = await result.user.getIdToken()
  } catch (error) {
    // Closing the popup is not an error worth showing
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') return null
    throw new Error('Google sign-in failed. Please try again.', { cause: error })
  }
  return startSession(api.post(AUTH_ROUTES.google, { idToken }))
}

// Clears the saved token and the Google session (if any)
export async function logout() {
  clearToken()
  await signOut(firebaseAuth).catch(() => {})
}

// { user, school } of the signed-in user
export async function getMe() {
  return (await api.get(AUTH_ROUTES.me)).data
}

// `data`: { fullName, email, password }. Sends the confirmation email.
export async function register({ fullName, email, password }) {
  return (await api.post(AUTH_ROUTES.register, { fullName, email, password })).data
}

export async function resendConfirmation(email) {
  return (await api.post(AUTH_ROUTES.resendConfirmation, { email })).data
}

// Confirms the email from the private link and signs the user in.
export async function verifyEmail(token) {
  if (!token) throw new Error('This confirmation link is invalid or has expired.')
  return startSession(api.post(AUTH_ROUTES.verifyEmail, { token }))
}

export async function forgotPassword(email) {
  return (await api.post(AUTH_ROUTES.forgotPassword, { email })).data
}

export async function resetPassword(token, password) {
  if (!token) throw new Error('This reset link is invalid or has expired.')
  return (await api.post(AUTH_ROUTES.resetPassword, { token, password })).data
}

// `profile`: { user, school }. Returns the saved profile.
export async function updateProfile(profile) {
  return (await api.put(PROFILE_ROUTE, profile)).data
}

// `file`: an image File (PNG, JPG or WEBP, max 10 MB). Returns the updated profile.
export async function uploadProfilePhoto(file) {
  const form = new FormData()
  form.append('photo', file)
  return (await api.post(PROFILE_PHOTO_ROUTE, form, { timeout: 60000 })).data
}

// The photo needs the login token, so it is downloaded and shown from a temporary URL.
// Call URL.revokeObjectURL(url) when it is no longer shown.
export async function getProfilePhotoUrl() {
  const blob = await api.get(PROFILE_PHOTO_ROUTE, { responseType: 'blob' })
  return URL.createObjectURL(blob)
}

// Returns the updated profile
export async function deleteProfilePhoto() {
  return (await api.delete(PROFILE_PHOTO_ROUTE)).data
}

// Developer invitation: { email } of the invited person (doesn't use the invitation up)
export async function getInvitation(token) {
  if (!token) throw new Error('This invitation link is invalid or has expired.')
  return (await api.get(AUTH_ROUTES.invitation(token))).data
}

// Creates the developer account from the invitation and signs in. Returns { token, profile }.
export function registerDeveloper({ token, fullName, password }) {
  return startSession(api.post(AUTH_ROUTES.registerDeveloper, { token, fullName, password }))
}
