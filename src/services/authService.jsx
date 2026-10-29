// Mock API. Replace with real axios calls when the backend is ready.
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

export async function register(data) {
  await delay()
  return { email: data.email }
}

export async function resendConfirmation(email) {
  await delay()
  return { email }
}

export async function verifyEmail(token) {
  await delay()
  if (!token) throw new Error('This confirmation link is invalid or has expired.')
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
