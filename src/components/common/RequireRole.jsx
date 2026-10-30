import { Navigate } from 'react-router-dom'
import useRole from '../../hooks/useRole'

// Shows the page only for these roles; others go to the dashboard.
// The backend checks the role too; this only hides pages.
function RequireRole({ roles, children }) {
  const { accessRole } = useRole()
  if (!roles.includes(accessRole)) return <Navigate to="/dashboard" replace />
  return children
}

export default RequireRole
