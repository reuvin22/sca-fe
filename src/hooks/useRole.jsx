import { useSelector } from 'react-redux'

const DEFAULT_ROLES = ['sca-1']

// The signed-in user's access roles, e.g. ['sca-1'] or ['sca-1', 'dev'] ('sca-1' | 'sca-2' | 'sca-3' | 'dev').
// A user with several roles sees each role's pages once.
function useRole() {
  const accessRoles = useSelector((state) => state.auth.user?.accessRoles) ?? DEFAULT_ROLES
  const hasRole = (role) => accessRoles.includes(role)
  return {
    accessRoles,
    hasRole,
    isDev: hasRole('dev'),
    isCounselor: accessRoles.some((role) => role.startsWith('sca-')),
  }
}

export default useRole
