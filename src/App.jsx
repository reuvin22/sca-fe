import { BrowserRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import AppRoutes from './routes/AppRoutes'
import useApplyTheme from './hooks/useApplyTheme'

function App() {
  useApplyTheme()
  const theme = useSelector((state) => state.ui.theme)

  return (
    <BrowserRouter>
      <AppRoutes />
      {/* Success messages after create / update / delete */}
      <ToastContainer position="top-right" autoClose={3000} newestOnTop theme={theme === 'dark' ? 'dark' : 'light'} />
    </BrowserRouter>
  )
}

export default App
