import React, { useEffect, useState } from 'react'
import TableProperty from '../../components/TableProperty/TableProperty'
import { getProfile } from '../../service/ProfileService'
import { User } from '../../types/user'

export default function SellerPage() {
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const [_opened, setOpened] = useState(false)
  const [userProfile, setUserProfile] = useState<User>()
  const getUserProfile = async () => {
    const res = await getProfile()
    setUserProfile(res)
  }

  useEffect(() => {
    getUserProfile()
  }, [shouldUpdate])

  return (
    <>
      <div className="mt-[30px] font-archivo">
        <TableProperty
          setShouldUpdate={setShouldUpdate}
          shouldUpdate={shouldUpdate}
          userBalance={userProfile?.balance}
          setOpened={setOpened}
        />
      </div>
    </>
  )
}
