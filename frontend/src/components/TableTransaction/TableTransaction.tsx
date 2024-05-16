import React, { useEffect, useState } from 'react'
import style from './TableTransaction.module.scss'
import {
  Table,
  Box,
  LoadingOverlay,
  Pagination,
  Image,
  SegmentedControl,
} from '@mantine/core'
import { getAllTransactions } from '../../service/AdminService'
import { getTransactionHistory } from '../../service/TransactionService'
import {
  convertISOToVNDateTimeString,
  formatDateToYYYYMMDD,
  getSevenDaysBeforeToday,
} from '../../utils/commonFunctions'
// import { FaSearch } from 'react-icons/fa'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendar, IconHistory } from '@tabler/icons-react'
import { primary } from '../../constants/color.constant'
import TableServiceTransaction from './TableServiceTransaction'
import { User } from '../../types/user'
import { RxAvatar } from 'react-icons/rx'

interface TableTransactionProps {
  isSeller: boolean
  user?: User | null
}

export default function TableTransaction({
  isSeller,
  user,
}: TableTransactionProps) {
  const [activePage, setActivePage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [dateValues, setDateValues] = useState<[Date | null, Date | null]>([
    getSevenDaysBeforeToday(),
    new Date(),
  ])

  const [transactions, setTransactions] = useState<[]>([])
  const [segmentValue, setSegmentValue] = useState('transactions')

  const handleGetAllTransactions = async (
    fromDateRange?: string,
    toDateRange?: string,
    page?: number,
  ) => {
    try {
      setIsLoading(true)
      const res = !isSeller
        ? await getAllTransactions(
            fromDateRange ?? null,
            toDateRange ?? null,
            page ?? activePage,
            user ? String(user?.userId) : null,
          )
        : await getTransactionHistory(
            fromDateRange ?? null,
            toDateRange ?? null,
            page ?? activePage,
          )

      setTransactions(res.data)
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
    handleGetAllTransactions(
      formatDateToYYYYMMDD(dateValues[0]),
      formatDateToYYYYMMDD(dateValues[1]),
      activePage,
    )
  }, [activePage])

  useEffect(() => {
    // to make sure we have the date range
    if (dateValues[0] && dateValues[1]) {
      handleGetAllTransactions(
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
    transactions.length > 0 ? (
      transactions.map((transaction: any) => (
        <Table.Tr key={transaction.transactionId} className="text-base h-16">
          <Table.Td>{transaction.transactionId}</Table.Td>
          <Table.Td>+ {Number(transaction.amountInCredits)}</Table.Td>
          <Table.Td>{transaction.description}</Table.Td>
          <Table.Td>
            {convertISOToVNDateTimeString(transaction.createdAt)}
          </Table.Td>
        </Table.Tr>
      ))
    ) : (
      <h3 className="px-2 ">There is no transaction yet.</h3>
    )

  return (
    <>
      <div className={style.tablePropertyContainer}>
        <div className={style.tablePropertyContent}>
          {isSeller && (
            <div className="mt-5 flex justify-center">
              <SegmentedControl
                transitionDuration={200}
                transitionTimingFunction="linear"
                styles={{
                  root: {
                    paddingTop: '5px',
                    paddingBottom: '5px',
                  },
                  label: {
                    fontWeight: 'bold',
                    color: '#396652',
                    fontSize: '18px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                }}
                className="text-primary"
                value={segmentValue}
                onChange={setSegmentValue}
                data={[
                  { label: 'Transaction', value: 'transactions' },
                  { label: 'Services', value: 'services' },
                ]}
              />
            </div>
          )}
          {segmentValue === 'transactions' && (
            <>
              <div className={`mt-3 flex items-end justify-between`}>
                <div className={style.tableHeader}>
                  <div className={style.pageTitle}>
                    <span className={style.title}>Transaction List</span>
                    <span className={style.subTitle}>
                      Manage Your Transaction
                    </span>
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
              {user && (
                <div className="flex items-center mt-6">
                  <div className=" w-[50px] h-[50px] flex">
                    {user?.avatar ? (
                      <Image radius="xl" alt="User Avatar" src={user?.avatar} />
                    ) : (
                      <RxAvatar className=" h-full w-full" />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold">{`Email: ${user?.email}`}</div>
                    <div>{`ID: ${user?.userId}`}</div>
                  </div>
                </div>
              )}

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
                          <Table.Th>Transaction ID</Table.Th>
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
          )}

          {segmentValue === 'services' && <TableServiceTransaction />}
        </div>
      </div>
    </>
  )
}
