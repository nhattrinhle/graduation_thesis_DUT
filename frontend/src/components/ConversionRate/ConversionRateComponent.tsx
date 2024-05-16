import React, { useEffect, useState } from 'react'
import style from './ConversionRate.module.scss'
import {
  Table,
  Box,
  LoadingOverlay,
  TextInput,
  Button,
  Modal,
  NumberInput,
} from '@mantine/core'
import {
  addNewCurrencyRate,
  deleteConversionRate,
  editConversionRate,
  getAllConversionRates,
} from '../../service/AdminService'
import { convertISOToVNDateTimeString } from '../../utils/commonFunctions'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import {
  useDisclosure,
  //  getHotkeyHandler
} from '@mantine/hooks'
import Swal from 'sweetalert2'
import { ConversionRate } from '../../types/conversionRate'
import { confirmBtn, cancelBtn } from '../../constants/color.constant'

// some comments in this component is kept for future use
export default function ConversionRateComponent() {
  const [isLoading, setIsLoading] = useState(false)
  // const [searchConversionRate, setSearchConversionRate] = useState('')
  const [opened, { open, close }] = useDisclosure(false, {
    onClose: () => setSelectedConversionRate(undefined),
  })
  const [conversionRates, setConversionRates] = useState<[]>([])
  const [fromCurrency, setFromCurrency] = useState('')
  const [fromCurrencyError, setFromCurrencyError] = useState('')
  const [exchangeRate, setExchangeRate] = useState<string | number>()
  const [exchangeRateError, setExchangeRateError] = useState('')
  const [selectedConversionRate, setSelectedConversionRate] =
    useState<ConversionRate>()
  const [shouldUpdate, setShouldUpdate] = useState(false)

  // const handleKeyDown = (event: any) => {
  //   setSearchConversionRate(event.currentTarget.value)
  //   handleGetAllConversionRates()
  // }
  const handleGetAllConversionRates = async () => {
    try {
      setIsLoading(true)
      const res = await getAllConversionRates()

      setConversionRates(res)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNewConversionRate = async () => {
    if (!fromCurrency) {
      setFromCurrencyError('From currency cannot be empty')
    }
    if (!exchangeRate) {
      setExchangeRateError('Exchange rate cannot be empty')
    }
    try {
      await addNewCurrencyRate(fromCurrency, 'Credit', Number(exchangeRate))
      Swal.fire({
        title: 'Successfully added new conversion rate!',
        icon: 'success',
      })
      setShouldUpdate((prev) => !prev)
    } catch (error) {
      console.error(error)
    } finally {
      setFromCurrencyError('')
      setExchangeRateError('')
    }
  }

  const handleShowSelectedConversionRate = async (conversionRateId: number) => {
    const selectedConversionRate = conversionRates.find(
      (cr: ConversionRate) => cr.conversionRateId === conversionRateId,
    )
    setSelectedConversionRate(selectedConversionRate)
    open()
  }

  const handleEditConversionRate = async () => {
    try {
      await editConversionRate(
        selectedConversionRate!.conversionRateId,
        Number(exchangeRate),
      )
      Swal.fire({
        title: 'Successfully updated conversion rate!',
        icon: 'success',
      })
      setShouldUpdate((prev) => !prev)
    } catch (error) {
      console.error(error)
    } finally {
      close()
      setSelectedConversionRate(undefined)
      setExchangeRate('')
    }
  }

  const handleDeleteConversionRate = async (conversionRateId: number) => {
    Swal.fire({
      title: 'Are you sure to delete this conversion rate?',

      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmBtn,
      cancelButtonColor: cancelBtn,
      confirmButtonText: 'Yes, delete!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteConversionRate(conversionRateId)
          Swal.fire({
            title: 'Successfully deleted conversion rate!',
            icon: 'success',
          })
          setShouldUpdate((prev) => !prev)
        } catch (error) {
          console.error(error)
        }
      }
    })
  }

  useEffect(() => {
    handleGetAllConversionRates()
  }, [shouldUpdate])

  const rows =
    conversionRates.length > 0 ? (
      conversionRates.map((cr: any) => (
        <Table.Tr
          key={cr.conversionRateId}
          className="text-base h-16"
          onClick={() => handleShowSelectedConversionRate(cr.conversionRateId)}
        >
          <Table.Td>{cr.conversionRateId}</Table.Td>
          <Table.Td>{cr.currencyFrom}</Table.Td>
          <Table.Td colSpan={1}>{cr.currencyTo}</Table.Td>
          <Table.Td>{cr.exchangeRate}</Table.Td>
          <Table.Td>{convertISOToVNDateTimeString(cr.updatedAt)}</Table.Td>

          <Table.Td onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-x-3">
              <FaEdit
                className={`${style.actionIcon} ${style.editIcon}`}
                onClick={() =>
                  handleShowSelectedConversionRate(cr.conversionRateId)
                }
              />
              <MdDelete
                display={'none'}
                className={`${style.actionIcon} ${style.deleteIcon}`}
                onClick={() => handleDeleteConversionRate(cr.conversionRateId)}
              />
            </div>
          </Table.Td>
        </Table.Tr>
      ))
    ) : (
      <div>There is no conversion rate yet</div>
    )

  return (
    <>
      <div className={style.tablePropertyContainer}>
        <div className={style.tablePropertyContent}>
          <div className={style.tableHeader}>
            <div className={style.pageTitle}>
              <span className={style.title}>Conversion Rate List </span>
              <span className={style.subTitle}>
                Manage Your Conversion Rate
              </span>
            </div>
          </div>
          {/* <div className="mt-5 flex justify-between items-end">
            <div className={style.searchContainer}>
              <TextInput
                leftSection={<FaSearch color={primary} size={20} />}
                placeholder="Enter from currency..."
                size="md"
                radius={4}
                classNames={{ input: style.textInput }}
                onChange={(event) =>
                  setSearchConversionRate(event.target.value)
                }
                onKeyDown={getHotkeyHandler([['Enter', handleKeyDown]])}
              />
            </div>
            <Button onClick={open} size="md">
              <span className={style.iconBtn}>
                <FaPlus />
              </span>
              Add New Conversion Rate
            </Button>
          </div> */}
          <div className="mt-8">
            <Box pos="relative">
              <LoadingOverlay
                visible={isLoading}
                zIndex={10}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'pink', type: 'bars' }}
              />
              <Table.ScrollContainer minWidth={500}>
                <Table
                  bg="white"
                  highlightOnHover
                  withTableBorder
                  verticalSpacing="sm"
                >
                  <Table.Thead>
                    <Table.Tr className="text-base">
                      <Table.Th>Conversion Rate ID</Table.Th>
                      <Table.Th>From Currency</Table.Th>
                      <Table.Th>To Currency</Table.Th>
                      <Table.Th>Exchange Rate</Table.Th>
                      <Table.Th>Updated At</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Box>
          </div>
        </div>
      </div>
      <Modal opened={opened} onClose={close} centered>
        <div className="flex flex-col justify-center gap-y-5 mb-3">
          <h1 className=" font-bold text-[24px] my-0 text-center text-primary">
            {selectedConversionRate
              ? 'Edit Conversion Rate'
              : 'Add New Conversion Rate'}
          </h1>
          <TextInput
            size="md"
            error={fromCurrencyError}
            label="From Currency"
            placeholder="Input currency"
            value={
              selectedConversionRate
                ? selectedConversionRate.currencyFrom
                : fromCurrency
            }
            onChange={(event) => setFromCurrency(event.currentTarget.value)}
          />
          <TextInput
            size="md"
            label="To Currency"
            placeholder="Input currency"
            value="Credit"
          />
          <NumberInput
            size="md"
            error={exchangeRateError}
            allowNegative={false}
            label="Exchange Rate"
            placeholder="Input exchange rate"
            defaultValue={
              selectedConversionRate
                ? selectedConversionRate.exchangeRate
                : exchangeRate
            }
            onChange={setExchangeRate}
          />
          <small className=" font-bold text-primary">
            {selectedConversionRate
              ? 'Note: You can only change the exchange rate'
              : ''}
          </small>
          <Button
            className=" bg-primary"
            size="md"
            onClick={() => {
              selectedConversionRate
                ? handleEditConversionRate()
                : handleAddNewConversionRate()
            }}
          >
            {selectedConversionRate ? 'Update' : 'Add New'}
          </Button>
        </div>
      </Modal>
    </>
  )
}
