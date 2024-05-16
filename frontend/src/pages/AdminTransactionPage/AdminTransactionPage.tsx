import React from 'react'
import TableTransaction from '../../components/TableTransaction/TableTransaction'
import { useLocation } from 'react-router-dom'

function AdminTransactionPage() {
  const location = useLocation()

  return (
    <div className="mt-8">
      <TableTransaction isSeller={false} user={location.state?.user} />
    </div>
  )
}

export default AdminTransactionPage
