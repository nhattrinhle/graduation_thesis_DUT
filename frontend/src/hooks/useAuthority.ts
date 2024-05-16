import { useMemo } from 'react'
import { Roles } from '../types/role'
import isEmpty from 'lodash/isEmpty'

function useAuthority(
  userAuthority: string | null, 
  authority: Roles[] = [],
  emptyCheck = false,
  ) {
  const roleMatched = useMemo(() => {    
    return authority.some(
      (role) => Number(userAuthority) === Number(role))
  }, [authority, userAuthority])

  if (
    isEmpty(authority) &&
    isEmpty(userAuthority) 
  ) {
    return !emptyCheck
  }

  return roleMatched
}

export default useAuthority