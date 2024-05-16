import React, { useState } from 'react'
// import TableUser from '../../components/TableUser/TableUser'
import TableSeller from '../../components/TableSeller/TableSeller'
import { SegmentedControl } from '@mantine/core'
import { Roles } from '../../types/role'
import style from './AdminMangeUserPage.module.scss'
import TableUser from '../../components/TableUser/TableUser'
function AdminMangeUserPage() {
  const [segment, setSegment] = useState(String(Roles.Seller))

  return (
    <div className="mt-8">
      <div className={style.tablePropertyContainer}>
        <div className={style.tablePropertyContent}>
          <div className={style.tableHeader}>
            {segment === String(Roles.Seller) ? (
              <div className={style.pageTitle}>
                <span className={style.title}>Seller List </span>
                <span className={style.subTitle}>Manage Your Seller</span>
              </div>
            ) : (
              <div className={style.pageTitle}>
                <span className={style.title}>Customer List </span>
                <span className={style.subTitle}>Manage Your Customer</span>
              </div>
            )}
            <div>
              <SegmentedControl
                className="text-primary"
                value={segment}
                onChange={setSegment}
                data={[
                  { label: 'Seller', value: String(Roles.Seller) },
                  { label: 'Customer', value: String(Roles.User) },
                ]}
                styles={{
                  root: {
                    paddingTop: '5px',
                    paddingBottom: '5px',
                  },
                  label: {
                    fontWeight: 'bold',
                    color: '#396652',
                    fontSize: '18px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                }}
              />
            </div>
          </div>
          {segment === String(Roles.Seller) ? <TableSeller /> : <TableUser />}
        </div>
      </div>
    </div>
  )
}

export default AdminMangeUserPage
