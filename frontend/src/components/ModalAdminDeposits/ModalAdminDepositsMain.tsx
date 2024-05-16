import { NumberInput, Button } from '@mantine/core'
import { IconCurrencyDollar } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { ConversionRate } from '../../types/conversionRate'
import { GiCrownCoin } from 'react-icons/gi'
import { getConversionRateList } from '../../service/TransactionService'
import { MAX_CREDIT, MIN_CREDIT } from '../../constants/credit.constant'
import { User } from '@/types/user'
import { AdminDepositForUser } from '../../service/AdminService'
import Swal from 'sweetalert2'

interface Props {
  user: User
  setIsUpdated: (value: boolean) => void
  isUpdated: boolean
  onCloseDeposit: () => void
}

const ModalAdminDepositsMain = ({
  user,
  setIsUpdated,
  isUpdated,
  onCloseDeposit,
}: Props) => {
  const [conversionRate, setConversionRate] = useState('')
  const [shouldShowCheckoutForm, setShouldShowCheckoutForm] = useState(false)
  const [creditAmount, setCreditAmount] = useState<number | string>(0)
  const [creditAmountError, setCreditAmountError] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleGetConversionRate = async () => {
    const data = await getConversionRateList()
    const usdRate = data.find(
      (item: ConversionRate) => item.currencyFrom === 'USD',
    )
    setConversionRate(usdRate.exchangeRate)
  }
  useEffect(() => {
    handleGetConversionRate()
  }, [])

  const handleAddCredit = async () => {
    if (Number(creditAmount) < MIN_CREDIT) {
      setCreditAmountError('Please enter credit amount')
      return
    }
    if (Number(creditAmount) > MAX_CREDIT) {
      setCreditAmountError('You can only buy up to 500 credits')
      return
    }
    setCreditAmountError('')
    setShouldShowCheckoutForm(true)
    try {
      setIsLoading(true)
      await AdminDepositForUser(
        user.userId,
        (creditAmount as number) * Number(conversionRate),
        Number(creditAmount),
        Number(conversionRate),
      )
      onCloseDeposit()
      setIsUpdated(!isUpdated)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Successfully added credit',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
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
        leftSection={<GiCrownCoin size={25} color="#396652"></GiCrownCoin>}
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
          <IconCurrencyDollar size={25} color="#396652"></IconCurrencyDollar>
        }
        placeholder="In USD"
        label="Total Cost in Dollars"
      ></NumberInput>
      <div>
        <Button
          loading={isLoading}
          disabled={shouldShowCheckoutForm ? true : false}
          className={`${shouldShowCheckoutForm ? 'bg-orangeBtn text-white opacity-70' : 'bg-orangeBtn hover:bg-darkBlue'} `}
          fullWidth
          onClick={handleAddCredit}
        >
          Add Credit
        </Button>
      </div>
    </div>
  )
}

export default ModalAdminDepositsMain
