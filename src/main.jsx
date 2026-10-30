import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import './api/firebase' // starts Firebase
import { store } from './store'

// After a new deploy, a tab that was already open asks for old code files that no longer exist
// ("Failed to fetch dynamically imported module"). Reload once to get the new version.
// The flag stops a reload loop if the file is really missing; it clears after a successful load.
const RELOAD_FLAG = 'sca-reloaded-for-new-version'
window.addEventListener('vite:preloadError', (event) => {
  if (sessionStorage.getItem(RELOAD_FLAG)) return
  event.preventDefault()
  sessionStorage.setItem(RELOAD_FLAG, '1')
  window.location.reload()
})
setTimeout(() => sessionStorage.removeItem(RELOAD_FLAG), 10000)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
