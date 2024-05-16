import React, { useEffect, useState } from 'react'
import {
  AdminDepositForUser,
  getAllConversionRates,
} from '../../service/AdminService'
import { User } from '@/types/user'
import { Button, NumberInput } from '@mantine/core'
import Swal from 'sweetalert2'
interface Props {
  user: User
  setIsUpdated: (value: boolean) => void
  isUpdated: boolean
  onCloseDeposit: () => void
}

const ModalAdminDeposits = ({
  user,
  setIsUpdated,
  isUpdated,
  onCloseDeposit,
}: Props) => {
  const [amountInDollars, setAmountInDollars] = useState<number>(0)
  const [amountInCredits, setAmountInCredits] = useState<number>(0)
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getConversionRate = async () => {
    const res = await getAllConversionRates()
    setExchangeRate(Number(res[0].exchangeRate))
  }
  useEffect(() => {
    getConversionRate()
  }, [])

  useEffect(() => {
    setAmountInDollars(exchangeRate * amountInCredits)
  }, [amountInCredits, exchangeRate])

  const handleAddCredit = async () => {
    try {
      setIsLoading(true)
      await AdminDepositForUser(
        user.userId,
        amountInDollars,
        amountInCredits,
        exchangeRate,
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
    <div>
      <div>
        <NumberInput
          hideControls
          label="Amount of credits:"
          placeholder="Enter credits amount"
          onChange={(value) => {
            setAmountInCredits(Number(value))
          }}
        />
      </div>
      <div className="flex justify-end mt-3">
        <Button
          loading={isLoading}
          onClick={() => {
            handleAddCredit()
          }}
        >
          Add credit
        </Button>
      </div>
    </div>
  )
}

export default ModalAdminDeposits
