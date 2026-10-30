import { Navigate } from 'react-router-dom'
import useRole from '../../hooks/useRole'

// Shows the page to users with at least one of these roles; others go to the dashboard.
// The backend checks the role too; this only hides pages.
function RequireRole({ roles, children }) {
  const { hasRole } = useRole()
  if (!roles.some(hasRole)) return <Navigate to="/dashboard" replace />
  return children
}

export default RequireRole
