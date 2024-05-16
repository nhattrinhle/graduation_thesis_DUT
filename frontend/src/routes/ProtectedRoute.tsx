import React from 'react'
import appConfig from '../configs/app.config'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Swal from 'sweetalert2'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
  const { authenticated } = useAuth()

  if (!authenticated) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please sign in first!',
      showConfirmButton: false,
      timer: 2000,
    })
    return <Navigate replace to={`${unAuthenticatedEntryPath}`} />
  }

  return <Outlet />
}

export default ProtectedRoute
