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
