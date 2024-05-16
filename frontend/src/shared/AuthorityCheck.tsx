import React, { PropsWithChildren } from 'react'
import useAuthority from '../hooks/useAuthority'
import { Roles } from '../types/role'

type AuthorityCheckProps = PropsWithChildren<{
  userAuthority?: string | null
  authority?: Roles[]
}>

const AuthorityCheck = (props: AuthorityCheckProps) => {
  const { userAuthority = '', authority = [], children } = props

  const roleMatched = useAuthority(userAuthority, authority)

  return <>{roleMatched ? children : null}</>
}

export default AuthorityCheck
