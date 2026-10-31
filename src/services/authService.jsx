import { getRedirectResult, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth'
import api from '../api/axios'
import { firebaseAuth, googleProvider, googleSignInByRedirect } from '../api/firebase'
import { AUTH_ROUTES, PROFILE_PHOTO_ROUTE, PROFILE_ROUTE } from '../api/routes'
import { clearToken, getDeviceToken, getToken, saveDeviceToken, saveToken } from '../utils/authStorage'

// Sign-in calls return { token, profile } and save the token. Put it in the store with signIn().
async function startSession(request) {
  const session = (await request).data
  saveToken(session.token)
  return session
}

// Password sign-in, step 1: checks the password and emails a 6-digit code.
// Returns { codeRequired, challenge, email (masked) } for step 2, or { token, profile } (token saved)
// when this browser entered a code in the last day.
export async function login({ email, password }) {
  const deviceToken = getDeviceToken() || undefined
  const result = (await api.post(AUTH_ROUTES.login, { email, password, deviceToken })).data
  if (result.token) saveToken(result.token)
  return result
}

// Step 2: the code from the email. Returns { token, profile } and saves the token,
// and remembers this browser for 1 day.
export async function verifyLoginCode({ challenge, code }) {
  const session = await startSession(api.post(AUTH_ROUTES.loginVerify, { challenge, code }))
  if (session.deviceToken) saveDeviceToken(session.deviceToken)
  return session
}

// Emails a new code for the same sign-in
export async function resendLoginCode(challenge) {
  return (await api.post(AUTH_ROUTES.loginResend, { challenge })).data
}

// The backend is on Render's free plan: when it is asleep it needs about 50 s to wake up.
// Google sign-in waits up to 2 minutes instead of failing with a connection error.
const GOOGLE_LOGIN_TIMEOUT = 120000

const googleFailed = (error) => new Error('Google sign-in failed. Please try again.', { cause: error })

// The backend checks the Google ID token and returns our own login token
async function sendGoogleToken(user) {
  const idToken = await user.getIdToken()
  return startSession(api.post(AUTH_ROUTES.google, { idToken }, { timeout: GOOGLE_LOGIN_TIMEOUT }))
}

// "Continue with Google". With the redirect (see api/firebase) the page goes to Google and comes back
// to the login page, which then calls finishGoogleRedirect(). Otherwise a popup is used.
// Returns { token, profile }, or null when nothing more happens here (redirecting, or popup closed).
export async function loginWithGoogle() {
  if (googleSignInByRedirect) {
    await signInWithRedirect(firebaseAuth, googleProvider)
    return null // the browser is leaving this page
  }
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider)
    return await sendGoogleToken(result.user)
  } catch (error) {
    // Closing the popup is not an error worth showing
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') return null
    // Firebase errors (they have a code) get a friendly message; backend errors are already friendly
    throw error.code ? googleFailed(error) : error
  }
}

// After coming back from Google (redirect sign-in): finishes signing in.
// Returns { token, profile }, or null when the page wasn't opened by a Google redirect.
export async function finishGoogleRedirect() {
  if (!googleSignInByRedirect) return null
  let result
  try {
    result = await getRedirectResult(firebaseAuth)
  } catch (error) {
    throw googleFailed(error)
  }
  return result ? sendGoogleToken(result.user) : null
}

// Signs out this device: the server stops accepting the token, then the saved token and the
// Google session (if any) are cleared. Works offline too (the token is still removed here).
export async function logout() {
  if (getToken()) await api.post(AUTH_ROUTES.logout).catch(() => {})
  clearToken()
  await signOut(firebaseAuth).catch(() => {})
}

// Signs out every device where this account is signed in, including this one
export async function logoutEverywhere() {
  await api.post(AUTH_ROUTES.logoutAll)
  clearToken()
  await signOut(firebaseAuth).catch(() => {})
}

// { user, school } of the signed-in user
export async function getMe() {
  return (await api.get(AUTH_ROUTES.me)).data
}

// `data`: { fullName, email, password }. Sends the confirmation email.
export async function register({ fullName, email, password, phone, address }) {
  return (await api.post(AUTH_ROUTES.register, { fullName, email, password, phone, address })).data
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

// Developer invitation: { email, hasAccount } of the invited person (doesn't use the invitation up)
export async function getInvitation(token) {
  if (!token) throw new Error('This invitation link is invalid or has expired.')
  return (await api.get(AUTH_ROUTES.invitation(token))).data
}

// Creates the developer account from the invitation and signs in. Returns { token, profile }.
export function registerDeveloper({ token, fullName, password }) {
  return startSession(api.post(AUTH_ROUTES.registerDeveloper, { token, fullName, password }))
}

// An existing account accepts the invitation and gets the developer role. Returns { email }.
export async function acceptInvitation(token) {
  return (await api.post(AUTH_ROUTES.acceptInvitation, { token })).data
}
