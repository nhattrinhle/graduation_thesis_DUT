import BalanceViewer from '../../components/ProgressCard/BalanceViewer'
import MapProperties from '../../components/Map/MapProperties'
import React, { useEffect, useState } from 'react'
import {
  IconBuildingSkyscraper,
  IconCreditCardRefund,
  IconInbox,
  IconUser,
} from '@tabler/icons-react'
import {
  getContactsCountedByDate,
  getPropertiesCountedByFeature,
  getTotalAccountsByRole,
  getTotalAmountDeposited,
  getTotalAmountDepositedByDate,
} from '../../service/AdminService'
import { Box, LoadingOverlay } from '@mantine/core'
import {
  formatDateToYYYYMMDD,
  getLastTwoWeeksIncludingToday,
} from '../../utils/commonFunctions'
import BarChart from '../../components/Charts/BarChart'
import style from './AdminDashboardPage.module.scss'

const AdminDashboardPage = () => {
  const [totalProperties, setTotalProperties] = useState(0)
  const [totalAmountDeposited, setTotalAmountDeposited] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [totalAccounts, setTotalAccounts] = useState(0)
  const [totalContacts, setTotalContacts] = useState(0)
  const [totalLastWeekAmount, setTotalLastWeekAmount] = useState<number[]>([])
  const [totalThisWeekAmount, setTotalThisWeekAmount] = useState<number[]>([])
  

  const handleGetPropertiesCountedByFeature = async () => {
    try {
      setIsLoading((_prev) => true)
      const data = await getPropertiesCountedByFeature()
      const totalCount = data.metaData.reduce(
        (total: number, item: any) => total + item.count,
        0,
      )
      setTotalProperties(totalCount)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading((_prev) => false)
    }
  }

  const handleGetTotalAmountDeposited = async () => {
    const res = await getTotalAmountDeposited()
    setTotalAmountDeposited(res.metaData)
  }

  const handleGetTotalAccountsByRole = async () => {
    const data = await getTotalAccountsByRole()

    const totalInNumber = data.metaData.reduce(
      (a: any, b: any) => a + b.totalAccounts,
      0,
    )
    setTotalAccounts((_prev) => totalInNumber)
  }
  const handleGetTotalContacts = async () => {
    const res = await getContactsCountedByDate(
      formatDateToYYYYMMDD(new Date('2024-01-15'))!,
      formatDateToYYYYMMDD(new Date())!,
    )
    const totalContactsInNumber = res.metaData.data.reduce(
      (a: any, b: any) => a + b.count,
      0,
    )
    setTotalContacts((_prev) => totalContactsInNumber)
  }

  const handleGetTotalAmountDepositedByDate = async () => {
    const allDates = getLastTwoWeeksIncludingToday()

    const res = await getTotalAmountDepositedByDate(
      formatDateToYYYYMMDD(allDates[0])!,
      formatDateToYYYYMMDD(allDates[1])!,
    )

    const formattedDataLastWeek: number[] = []
    const formattedDataThisWeek: number[] = []

    res.metaData.data.map((el: any, index: number) => {
      if (index < 7) {
        formattedDataLastWeek.push(Number(el.amountInDollars))
      } else {
        formattedDataThisWeek.push(Number(el.amountInDollars))
      }
    })

    setTotalLastWeekAmount(formattedDataLastWeek)
    setTotalThisWeekAmount(formattedDataThisWeek)
  }

  useEffect(() => {
    handleGetTotalAmountDeposited()
    handleGetTotalAccountsByRole()
    handleGetTotalAmountDepositedByDate()
    handleGetTotalContacts()
    handleGetPropertiesCountedByFeature()
  }, [])

  return (
    <>
      <Box pos="relative" className="mt-8 rounded-md px-4 font-archivo">
        <LoadingOverlay
          visible={isLoading === true ? true : false}
          zIndex={10}
          overlayProps={{ radius: 'lg', blur: 5 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
          classNames={{
            loader: 'absolute top-20 ',
          }}
        />
        <div>
          <h2 className="text-primary mt-0 mb-1">OVERVIEW</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-y-5">
              <div className="grid grid-cols-2 gap-x-4 items-center sm:gap-y-12 mobile:gap-y-5">
                <div className="h-[150px] col-span-2 sm:col-span-1">
                  <BalanceViewer
                    balance={totalProperties}
                    background="rgba(11, 200, 0, 0.38)"
                    icon={<IconBuildingSkyscraper size={40} />}
                    title="Total Properties"
                    isCreditBalance={false}
                  />
                </div>
                <div className=" h-[150px] col-span-2 sm:col-span-1">
                  <BalanceViewer
                    balance={totalAmountDeposited}
                    background="#66d9e880"
                    icon={<IconCreditCardRefund size={40} />}
                    title="Total Revenue"
                    isCreditBalance={false}
                    isMoney={true}
                  />
                </div>
                <div className="h-[150px] col-span-2 sm:col-span-1">
                  <BalanceViewer
                    balance={totalAccounts}
                    background="rgba(255, 173, 194, 0.38)"
                    icon={<IconUser size={40} />}
                    title="Total Users"
                    isCreditBalance={false}
                  />
                </div>
                <div className="h-[150px] col-span-2 sm:col-span-1">
                  <BalanceViewer
                    balance={totalContacts}
                    background="rgb(221 219 83)"
                    icon={<IconInbox size={40} />}
                    title="Total Contacts"
                    isCreditBalance={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className={style.countedByDate}>
                <BarChart
                  depositedCreditsLastWeek={totalLastWeekAmount}
                  depositedCreditsThisWeek={totalThisWeekAmount}
                  title="Total Revenue In Two Weeks"
                />
              </div>
            </div>

            <div className="col-span-12 mt-7">
              <h2 className="text-primary mt-0 mb-1">PROPERTY DISTRIBUTION</h2>
              <MapProperties />
            </div>
          </div>
        </div>
      </Box>
    </>
  )
}

export default AdminDashboardPage
