import React, { useEffect, useState } from 'react'
import style from './TableTransaction.module.scss'
import { Table, Box, LoadingOverlay, Pagination } from '@mantine/core'
import {
  convertISOToVNDateTimeString,
  formatDateToYYYYMMDD,
  getSevenDaysBeforeToday,
} from '../../utils/commonFunctions'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendar, IconHistory } from '@tabler/icons-react'
import { primary } from '../../constants/color.constant'
import { getTransactionRentService } from '../../service/SellerService'

export default function TableServiceTransaction() {
  const [activePage, setActivePage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [dateValues, setDateValues] = useState<[Date | null, Date | null]>([
    getSevenDaysBeforeToday(),
    new Date(),
  ])

  const [services, setServices] = useState<[]>([])

  const handleGetAllServiceHistory = async (
    fromDateRange?: string,
    toDateRange?: string,
    page?: number,
  ) => {
    try {
      setIsLoading(true)
      const res = await getTransactionRentService(
        fromDateRange ?? null,
        toDateRange ?? null,
        page ?? activePage,
        10,
      )
      setServices((_prev) => res.data)
      setTotalPages(res.totalPages)
      setTotalItems(res.totalItems)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeActivePage = async (page: any) => {
    setActivePage(page)
  }

  useEffect(() => {
    handleGetAllServiceHistory(
      formatDateToYYYYMMDD(dateValues[0]),
      formatDateToYYYYMMDD(dateValues[1]),
      activePage,
    )
  }, [activePage])

  useEffect(() => {
    // to make sure we have the date range
    if (dateValues[0] && dateValues[1]) {
      handleGetAllServiceHistory(
        formatDateToYYYYMMDD(dateValues[0]),
        formatDateToYYYYMMDD(dateValues[1]),
        1,
      )
      setActivePage(1)
    }
    // for reset purpose
    if (!dateValues[0] && !dateValues[1]) {
      setDateValues([getSevenDaysBeforeToday(), new Date()])
      setActivePage(1)
    }
  }, [dateValues[1]])

  const rows =
    services.length > 0 ? (
      services.map((service: any, index) => (
        <Table.Tr key={service.transactionId} className="text-base h-16">
          <Table.Td>{index + 1 + (activePage - 1) * 10}</Table.Td>
          <Table.Td>- {Number(service.amountInCredits)}</Table.Td>
          <Table.Td>{service.description}</Table.Td>
          <Table.Td>{convertISOToVNDateTimeString(service.createdAt)}</Table.Td>
        </Table.Tr>
      ))
    ) : (
      <div>There is no service history yet</div>
    )

  return (
    <>
      <div className="mt-3 flex items-end justify-between">
        <div className={style.tableHeader}>
          <div className={style.pageTitle}>
            <span className={style.title}>Service History </span>
            <span className={style.subTitle}>Manage Your Service History</span>
          </div>
        </div>
        <DatePickerInput
          clearable={true}
          allowSingleDateInRange={true}
          leftSection={<IconCalendar color={primary} stroke={1.5} />}
          rightSection={
            <IconHistory
              color={primary}
              stroke={1.5}
              className=" cursor-pointer"
              onClick={() =>
                setDateValues([getSevenDaysBeforeToday(), new Date()])
              }
            />
          }
          size="md"
          classNames={{
            day: style.day,
            weekday: ' text-gray-600 font-bold',
          }}
          w={330}
          type="range"
          label="Pick date range"
          placeholder="Pick date range"
          value={dateValues}
          onChange={setDateValues}
        />
      </div>
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
                  <Table.Th>No.</Table.Th>
                  <Table.Th>Credits</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Created At</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          <div className="flex justify-between my-2 items-baseline">
            <Pagination
              total={totalPages}
              value={activePage}
              mt="sm"
              onChange={handleChangeActivePage}
              classNames={{ control: style.paginationControl }}
            />
            <div className="text-lg mr-2 text-primary font-bold">
              Result: {totalItems}
            </div>
          </div>
        </Box>
      </div>
    </>
  )
}
