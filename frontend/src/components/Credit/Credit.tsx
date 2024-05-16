import React, { useEffect, useState } from 'react'
import style from './Credit.module.scss'
import { IoIosNotifications } from 'react-icons/io'
import { getTransactionRentService } from '../../service/SellerService'
import { formatDate, sortTransactionsByDate } from '../../utils/commonFunctions'
import { getProfile } from '../../service/ProfileService'
import { User } from '@/types/user'
import { IoCalendarNumberOutline } from 'react-icons/io5'
import { Button } from '@mantine/core'
import { HistoryTransaction } from '../../types/historyTransaction'
import { GiCrownCoin } from 'react-icons/gi'

interface CreditProps {
  shouldUpdate: boolean
}
const Credit = ({ shouldUpdate }: CreditProps) => {
  const [userProfile, setUserProfile] = useState<User>()
  const [historiesRentService, setHistoriesRentService] = useState<
    HistoryTransaction[]
  >([])
  const getTransaction = async () => {
    try {
      const res = await getTransactionRentService()
      setHistoriesRentService(sortTransactionsByDate(res?.data.metaData.data))
      return res
    } catch (error) {
      console.error(error)
    }
  }

  const getUserProfile = async () => {
    const res = await getProfile()
    setUserProfile(res)
  }
  useEffect(() => {
    getTransaction()
    getUserProfile()
  }, [shouldUpdate])

  return (
    <div className={style.creditContainer}>
      <div className={style.creditContent}>
        <div className={style.creditCurrent}>
          <div className={style.creditCurrentHead}>
            <div className={style.titleText}>Current credit</div>
            <div className={style.creditCurrentRow}>
              {userProfile && (
                <span className={style.creditAmount}>
                  {Number(userProfile.balance)}
                </span>
              )}
              <span className={style.creditIcon}>
                <GiCrownCoin />
              </span>
            </div>
          </div>
          <div className={style.creditBtn}>
            <Button classNames={{ root: style.rootButton }}>Buy Credit</Button>
          </div>
        </div>
        <div className={style.creditNoti}>
          <div className="flex flex-row items-center justify-between relative">
            <div className={style.title}>
              <span className={style.titleText}>Transaction history</span>
              <span className={style.titleIcon}>
                <IoIosNotifications />
              </span>
            </div>
            <span>
              <IoCalendarNumberOutline className="w-8 h-auto text-primary cursor-pointer hover:text-darkBlue" />
            </span>
          </div>
          <div className={style.detailNoti}>
            {historiesRentService.length > 0 ? (
              historiesRentService.map((history, index) => (
                <div key={index} className={style.row}>
                  <div className={style.date}>
                    {formatDate(history.createdAt)}
                  </div>
                  <div className={style.content}>
                    {history.description
                      ? history.description
                      : 'You have deposited into your account'}
                  </div>
                  <div className={style.quantity}>
                    <span className={style.symbol}>
                      {history.description ? '-' : '+'}
                    </span>
                    <span className={style.money}>
                      {history.amountInCredits}
                    </span>
                    <span className={style.icon}>
                      <GiCrownCoin />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div>You have not made any transactions yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Credit
