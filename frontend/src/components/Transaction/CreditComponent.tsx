import React, { useState } from 'react'
import style from './Transaction.module.scss'
import { User } from '../../types/user'
import { Button } from '@mantine/core'
import { GiCrownCoin } from 'react-icons/gi'
import UnderMaintenance from '../UnderMaintenance/UnderMaintenance'
import { getMaintenanceModeForSeller } from '../../service/MaintenanceService'

interface CreditComponentProps {
  setOpened: (value: boolean) => void
  userProfile?: User
  conversionRate: string
}
export default function CreditComponent({
  setOpened,
  userProfile,
  conversionRate,
}: CreditComponentProps) {
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')

  const handleGetMaintenanceMode = async () => {
    try {
      const res = await getMaintenanceModeForSeller()
      setIsUnderMaintenance((_prev) => res.metaData.isMaintenance)
      setMaintenanceMessage((_prev) => res.metaData.description)
      // if system is not under maintenance then open modal
      if (res.metaData.isMaintenance === false) {
        setOpened(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className={style.creditCurrentHead}>
          <div className={style.titleText}>Current credit</div>
          <div className={style.creditCurrentRow}>
            {userProfile && (
              <h1 className={style.creditAmount}>
                {Number(userProfile.balance)}
              </h1>
            )}
            <span className={style.creditIcon}>
              <GiCrownCoin />
            </span>
          </div>
        </div>
        <span className="text-gray-00 italic">
          Before buying credit, you need to review current conversion rate
          below!*
        </span>
        <div className={style.creditBtn}>
          <Button
            classNames={{ root: style.rootButton }}
            fullWidth
            onClick={() => {
              handleGetMaintenanceMode()
            }}
          >
            Buy Credit
          </Button>
        </div>

        <UnderMaintenance
          setStatus={setIsUnderMaintenance}
          status={isUnderMaintenance}
          maintenanceMessage={maintenanceMessage}
        />
      </div>
      <div className={style.conversionRateLine}>
        <hr></hr>
        <div className={style.currentConversionRate}>
          Current Conversion Rate
        </div>
        <div className="flex justify-center gap-x-1">
          <span className={style.currentConversionRate}>1</span>
          <span className={style.creditIcon}>
            <GiCrownCoin size={18} />
          </span>
          <span className={style.currentConversionRate}>
            = {Number(conversionRate)} dollars
          </span>
        </div>
      </div>
    </>
  )
}
