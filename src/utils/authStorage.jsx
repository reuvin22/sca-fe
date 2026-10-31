// Keeps the login token so the user stays signed in after a refresh. Cleared on logout.
const TOKEN_KEY = 'sca_token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function saveToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Storage blocked (e.g. private mode): the user stays signed in until refresh
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Nothing to clear
  }
}

// "Remember this device": after a sign-in code, this browser can skip the code for 1 day.
// Kept after logout on purpose (it remembers the device, not the session). The server checks it.
const DEVICE_KEY = 'sca_trusted_device'

export function getDeviceToken() {
  try {
    return localStorage.getItem(DEVICE_KEY)
  } catch {
    return null
  }
}

export function saveDeviceToken(token) {
  try {
    localStorage.setItem(DEVICE_KEY, token)
  } catch {
    // Storage blocked: the code will be asked every time
  }
}
