import { useAppSelector } from '../redux/hooks'

function useAuth() {
  const signedIn = useAppSelector((state) => state.session.signedIn)
  const tokens = useAppSelector((state) => state.session.signedIn)
  const roleId = useAppSelector((state) => state.user.roleId)

  return {
    authenticated: tokens && signedIn,
    roleId: roleId,
  }
}

export default useAuth
