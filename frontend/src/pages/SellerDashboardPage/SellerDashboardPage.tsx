import React, { useEffect, useState } from 'react'
import CreditComponent from '../../components/Transaction/CreditComponent'
import TransactionHistory from '../../components/Transaction/TransactionHistory'
import { Box, Button, LoadingOverlay, Modal, NumberInput } from '@mantine/core'
import {
  IconBuildingSkyscraper,
  IconCreditCardPay,
  IconCreditCardRefund,
  IconCurrencyDollar,
  IconInbox,
} from '@tabler/icons-react'
import style from '../../components/Transaction/Transaction.module.scss'
import { GiCrownCoin } from 'react-icons/gi'
import { getConversionRateList } from '../../service/TransactionService'
import { useNavigate } from 'react-router-dom'
import { MAX_CREDIT, MIN_CREDIT } from '../../constants/credit.constant'
import { ConversionRate } from '../../types/conversionRate'
import { getProfile } from '../../service/ProfileService'
import { User } from '../../types/user'
import {
  getPropertiesCountedByFeature,
  getTotalAmountDeposited,
  getTotalContacts,
  getTotalCreditsUsed,
} from '../../service/SellerService'
import BalanceViewer from '../../components/ProgressCard/BalanceViewer'

export default function SellerDashboardPage() {
  const navigate = useNavigate()
  const [shouldUpdate, _setShouldUpdate] = useState(false)
  const [opened, setOpened] = useState(false)
  const [conversionRate, setConversionRate] = useState('')
  const [creditAmount, setCreditAmount] = useState<number | string>(0)
  const [creditAmountError, setCreditAmountError] = useState('')
  const [shouldShowCheckoutForm, setShouldShowCheckoutForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<User>()
  const [totalProperties, setTotalProperties] = useState(0)
  const [totalCreditsDeposited, setTotalCreditsDeposited] = useState(0)
  const [totalCreditsUsed, setTotalCreditsUsed] = useState(0)
  const [totalContacts, setTotalContacts] = useState(0)

  const getUserProfile = async () => {
    const res = await getProfile()
    setUserProfile(res)
  }
  const handleGetConversionRate = async () => {
    const data = await getConversionRateList()
    const usdRate = data.find(
      (item: ConversionRate) => item.currencyFrom === 'USD',
    )
    setConversionRate(usdRate.exchangeRate)
  }

  const handleBuyCredit = async () => {
    if (Number(creditAmount) < MIN_CREDIT) {
      setCreditAmountError('Please enter credit amount')
      return
    }
    if (Number(creditAmount) > MAX_CREDIT) {
      setCreditAmountError('You can only buy up to 500 credits')
      return
    }

    setOpened(false)
    setCreditAmountError('')
    setShouldShowCheckoutForm(true)
    navigate('/transaction', {
      state: {
        creditAmount: creditAmount,
        conversionRate: conversionRate,
      },
    })
  }

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
    setTotalCreditsDeposited(res.metaData.totalAmountInCredits)
  }

  const handleGetTotalCreditsUsed = async () => {
    const res = await getTotalCreditsUsed()
    setTotalCreditsUsed(res.metaData)
  }

  const handleGetTotalContacts = async () => {
    const res = await getTotalContacts()
    setTotalContacts(res.metaData)
  }

  useEffect(() => {
    handleGetConversionRate()
    handleGetPropertiesCountedByFeature()
    handleGetTotalAmountDeposited()
    handleGetTotalCreditsUsed()
    handleGetTotalContacts()
  }, [])

  useEffect(() => {
    getUserProfile()
  }, [shouldUpdate])

  return (
    <>
      <Box pos="relative" className="mx-4 mt-[30px] font-archivo">
        <LoadingOverlay
          visible={isLoading === true ? true : false}
          zIndex={10}
          overlayProps={{ radius: 'lg', blur: 10 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
          classNames={{
            loader: 'absolute top-20 ',
          }}
        />
        <div className="flex flex-col gap-y-2 justify-between m-0">
          <h1 className="text-primary m-0">Overview</h1>
          <div className="flex justify-between items-center m-0">
            <div className="flex flex-wrap md:flex-row lg:flex lg:flex-row xl:flex xl:flex-row justify-between m-0 w-full gap-y-5">
              <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/4  xs:pr-4 ">
                <BalanceViewer
                  balance={totalProperties}
                  background="rgba(11, 200, 0, 0.38)"
                  icon={<IconBuildingSkyscraper size={40} />}
                  title="Total Properties"
                  isCreditBalance={false}
                />
              </div>
              <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/4  xs:pr-4 ">
                <BalanceViewer
                  balance={totalCreditsDeposited}
                  background="#66d9e880"
                  icon={<IconCreditCardRefund size={40} />}
                  title="Total Credits In"
                  isCreditBalance={true}
                />
              </div>
              <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/4  xs:pr-4 ">
                <BalanceViewer
                  balance={totalCreditsUsed}
                  background="rgba(255, 173, 194, 0.38)"
                  icon={<IconCreditCardPay size={40} />}
                  title="Total Credits Out"
                  isCreditBalance={true}
                />
              </div>
              <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/4  xs:pr-4 ">
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
        </div>

        <div className="mt-[30px] flex flex-col gap-y-2">
          <h1 className="text-primary m-0">Balance - Notifications</h1>
          <div>
            <div className=" grid grid-cols-12 gap-x-3 gap-y-10">
              <div className="  lg:col-span-5 mobile:col-span-12 bg-white shadow-xl rounded-[16px] pb-4 pt-2 px-5 flex flex-col items-center justify-between">
                <CreditComponent
                  setOpened={setOpened}
                  userProfile={userProfile}
                  conversionRate={conversionRate}
                />
              </div>
              <div className="lg:col-span-7 mobile:col-span-12 bg-white shadow-xl rounded-[16px] pb-4 pt-2 px-5 h-[350px]">
                <TransactionHistory shouldUpdate={shouldUpdate} />
              </div>
            </div>
          </div>
        </div>

        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          centered
          styles={{
            header: {
              height: '50px',
              paddingTop: '0px',
              paddingBottom: '0px',
            },
          }}
        >
          <div className="flex flex-col gap-y-5">
            <h1 className=" font-bold text-center text-lg my-0">
              Enter the number of credits you want to buy:
              <span className="font-bold text-center text-sm flex items-center justify-center my-0">
                1{' '}
                <GiCrownCoin
                  size={25}
                  color="#396652"
                  className=" mr-3"
                ></GiCrownCoin>
                <span className="mr-3">=</span>
                {Number(conversionRate)} dollars
              </span>
            </h1>

            <NumberInput
              readOnly={shouldShowCheckoutForm ? true : false}
              error={creditAmountError}
              value={creditAmount}
              onChange={(_value) => {
                setCreditAmountError('')
                setCreditAmount(_value)
              }}
              size="lg"
              leftSection={
                <GiCrownCoin size={25} color="#396652"></GiCrownCoin>
              }
              placeholder="Enter credit amount"
              allowDecimal={false}
              allowNegative={false}
              label="Credit Amount"
            ></NumberInput>
            <NumberInput
              readOnly
              value={(creditAmount as number) * Number(conversionRate)}
              size="lg"
              leftSection={
                <IconCurrencyDollar
                  size={25}
                  color="#396652"
                ></IconCurrencyDollar>
              }
              placeholder="In USD"
              label="Total Cost in Dollars"
            ></NumberInput>
            <div className={style.creditBtn}>
              <Button
                disabled={shouldShowCheckoutForm ? true : false}
                className={`${shouldShowCheckoutForm ? 'bg-orangeBtn text-white opacity-70' : 'bg-orangeBtn hover:bg-darkBlue'} `}
                fullWidth
                onClick={handleBuyCredit}
              >
                Process To Payment
              </Button>
            </div>
          </div>
        </Modal>
      </Box>
    </>
  )
}
