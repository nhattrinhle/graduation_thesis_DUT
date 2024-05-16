import React, { useEffect, useState } from 'react'
import { Box, LoadingOverlay, Tooltip } from '@mantine/core'
import style from './Transaction.module.scss'
import { IoIosNotifications } from 'react-icons/io'
import { IconDots } from '@tabler/icons-react'
import { GiCrownCoin } from 'react-icons/gi'
import { HistoryTransaction } from '../../types/historyTransaction'
import {
  convertISOToVNDateTimeString,
  sortTransactionsByDate,
} from '../../utils/commonFunctions'
import { getTransactionHistory } from '../../service/TransactionService'
import { getTransactionRentService } from '../../service/SellerService'
import { Link } from 'react-router-dom'

interface TransactionHistoryProps {
  shouldUpdate: boolean
}
export default function TransactionHistory({
  shouldUpdate,
}: TransactionHistoryProps) {
  const [histories, setHistories] = useState<HistoryTransaction[]>([])
  const [visible, setVisible] = useState(false)

  const getTransaction = async () => {
    try {
      setVisible(true)
      const data = await getTransactionHistory(null, null, null, null)
      const rentServiceHistory = await getTransactionRentService(
        null,
        null,
        null,
        null,
      )
      const combinedHistory = [...data.data, ...rentServiceHistory.data]

      setHistories(sortTransactionsByDate(combinedHistory).slice(0, 10))
    } catch (error) {
      setHistories([])
    } finally {
      setVisible(false)
    }
  }

  useEffect(() => {
    getTransaction()
  }, [shouldUpdate])

  return (
    <>
      <div className=" flex justify-between items-center font-sans">
        <div className="flex items-center gap-x-2">
          <span className="md:text-[30px] mobile:text-[24px] font-bold text-primary text-center font-archivo">
            Notifications
          </span>
          <b className="text-primary sm:text-[16px] mobile:text-[11px] italic ">{`(Latest)`}</b>
          <span className={style.titleIcon}>
            <IoIosNotifications />
          </span>
        </div>
        <div className="flex gap-x-5">
          <Tooltip label="View all transactions">
            <Link className={style.titleIcon} to="/seller-transaction">
              <IconDots
                size={22}
                className="outline outline-[#61a05e] outline-1 rounded-2xl"
              />
            </Link>
          </Tooltip>
        </div>
      </div>

      <Box pos="relative">
        <LoadingOverlay
          visible={visible}
          zIndex={9}
          loaderProps={{ color: 'pink', type: 'bars' }}
          overlayProps={{ radius: 'sm', blur: 0.7 }}
        />
        <div className=" max-h-[280px] overflow-y-scroll pr-4 flex flex-col gap-y-1">
          {histories.length > 0 ? (
            histories.map((history, index) => (
              <div key={index} className={style.row}>
                <div className=" w-[30%] text-start">
                  {convertISOToVNDateTimeString(history.createdAt)}
                </div>
                <div className=" flex w-[55%] justify-start text-start m-0 p-0">
                  {history.description}
                </div>
                <div className="w-[15%] flex justify-end items-center">
                  <span className={style.symbol}>
                    {history.description.includes('property') ? '-' : '+'}
                  </span>
                  <span className={style.money}>
                    {Number(history.amountInCredits)}
                  </span>
                  <span className={style.icon}>
                    <GiCrownCoin />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-[100px]">
              You have not made any transactions yet.
            </div>
          )}
        </div>
      </Box>
    </>
  )
}
