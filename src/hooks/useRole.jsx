import { useSelector } from 'react-redux'

// The signed-in user's access role: 'sca-1' | 'sca-2' | 'sca-3' | 'dev'
function useRole() {
  const accessRole = useSelector((state) => state.auth.user?.accessRole) ?? 'sca-1'
  return { accessRole, isDev: accessRole === 'dev' }
}

export default useRole
