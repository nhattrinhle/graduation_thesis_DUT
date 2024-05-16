import React, { useEffect, useState } from 'react'
import style from './TableUser.module.scss'
import {
  Button,
  Table,
  TextInput,
  Image,
  Switch,
  Tooltip,
  Box,
  LoadingOverlay,
  Pagination,
  Modal,
  Checkbox,
} from '@mantine/core'
import { FaEdit, FaSearch } from 'react-icons/fa'
import {
  deleteUserForAdminService,
  getAllUsersForAdmin,
  getUsersForAdminService,
  resetPasswordForAdmin,
  updateStatusUserForAdminService,
} from '../../service/AdminService'
import { User } from '../../types/user'
import { Roles } from '../../types/role'
import { MdDelete } from 'react-icons/md'
import { formatDateNoHours } from '../../utils/commonFunctions'
import { RxAvatar } from 'react-icons/rx'
import { SearchUsers } from '@/types/searchUsers'
import Swal from 'sweetalert2'
import { useDisclosure } from '@mantine/hooks'
import ModalManageUser from '../ModalManageUser/ModalManageUser'
import { cancelBtn, confirmBtn } from '../../constants/color.constant'

function TableUser() {
  const [email, setEmail] = useState('')
  const [userList, setUserList] = useState<User[]>([])
  const [activePage, setActivePage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [resetPage, setResetPage] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)
  const [userSelected, setUserSelected] = useState<User | null>(null)
  const [isUpdated, setIsUpdated] = useState(false)

  const getAllUser = async () => {
    try {
      const res = await getAllUsersForAdmin(Roles.User)
      setUserList(res.metaData.data)
      setTotalPages(res.metaData.totalPages)
      setTotalItems(res.metaData.totalItems)
    } catch (error: any) {
      Swal.fire({
        title: error.response.data.error.message,
        icon: 'error',
      })
    }
  }
  useEffect(() => {
    getAllUser()
  }, [isUpdated])

  const handleSearchUsers = async () => {
    const searchValues: SearchUsers = {
      roleId: Roles.User,
      email: email ? email : null,
      page: resetPage ? 1 : activePage,
      limit: 10,
      orderBy: null,
      sortBy: null,
    }
    try {
      setIsLoading(true)
      const res = await getUsersForAdminService(searchValues)
      setUserList(res.metaData.data)
      setTotalPages(res.metaData.totalPages)
      setTotalItems(res.metaData.totalItems)
      setActivePage(resetPage ? 1 : activePage)
      setResetPage(true)
    } catch (error: any) {
      Swal.fire({
        title: error.response.data.error.message,
        icon: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleSearchUsers()
    }
  }
  const handleUpdateStatusUser = async (userId: number, event: boolean) => {
    if (event) {
      Swal.fire({
        text: `Are you sure to enable customer who has id: ${userId} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: confirmBtn,
        cancelButtonColor: cancelBtn,
        confirmButtonText: 'Enable',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setIsLoading(true)
            await updateStatusUserForAdminService(userId)
            Swal.fire({
              title: 'activated!',
              text: 'Your customer has been activated.',
              icon: 'success',
            })
            setIsUpdated(!isUpdated)
          } catch (error: any) {
            Swal.fire({
              title: error.response.data.error.message,
              icon: 'error',
            })
          } finally {
            setIsLoading(false)
          }
        }
      })
    } else {
      Swal.fire({
        text: `Are you sure to disable customer who has id: ${userId} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: confirmBtn,
        cancelButtonColor: cancelBtn,
        confirmButtonText: 'Disable',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setIsLoading(true)
            await updateStatusUserForAdminService(userId)
            Swal.fire({
              title: 'De-activated!',
              text: 'Your customer has been de-activated.',
              icon: 'success',
            })
            setIsUpdated(!isUpdated)
          } catch (error: any) {
            Swal.fire({
              title: error.response.data.error.message,
              icon: 'error',
            })
          } finally {
            setIsLoading(false)
          }
        }
      })
    }
  }

  const handleChangeActivePage = async (page: any) => {
    setResetPage(false)
    setActivePage(page)
  }

  useEffect(() => {
    handleSearchUsers()
  }, [activePage])

  const openModalUser = (user: User) => {
    setUserSelected(user)
    open()
  }

  const handleDeleteUser = async (user: User) => {
    Swal.fire({
      icon: 'question',
      text: `Are you sure to delete customer who has id: ${user.userId}? `,
      showCancelButton: true,
      confirmButtonColor: confirmBtn,
      cancelButtonColor: cancelBtn,
      confirmButtonText: 'Delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true)
          await deleteUserForAdminService(String(user.userId))
          Swal.fire({
            title: 'Deleted!',
            text: `${user.fullName} has been deleted.`,
            icon: 'success',
          })
          setUserList(
            userList.filter((element) => element.userId !== user.userId),
          )
          setSelectedRows(
            selectedRows.filter((element) => element !== user.userId),
          )
        } catch (error: any) {
          Swal.fire({
            title: error.response.data.error.message,
            icon: 'error',
          })
        } finally {
          setIsLoading(false)
        }
      }
    })
  }

  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const allSelected = selectedRows.length === userList.length
  const handleSelectBox = (event: boolean, userId: number) => {
    if (event) {
      setSelectedRows([...selectedRows, userId])
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== userId))
    }
  }
  const handleSelectAllSelectedRows = () => {
    if (allSelected) {
      setSelectedRows([])
    } else {
      const allUserIds = userList.map((user) => user.userId)
      setSelectedRows(allUserIds)
    }
  }

  const handleDeleteAllSelectedRows = () => {
    if (selectedRows.length > 0) {
      const parseSelectedRowsToString = String(selectedRows)
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: confirmBtn,
        cancelButtonColor: cancelBtn,
        confirmButtonText: 'Delete',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteUserForAdminService(parseSelectedRowsToString)
            Swal.fire({
              title: 'Deleted!',
              text: `Selected Users has been deleted.`,
              icon: 'success',
            })
            setIsUpdated((prev) => !prev)
          } catch (error: any) {
            Swal.fire({
              title: error.response.data.error.message,
              icon: 'error',
            })
          }
        }
      })
    }
  }

  const handleResetPassword = (userId: number) => {
    if (!userId) return
    Swal.fire({
      text: `Are you sure to reset your password for userId: ${userId}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmBtn,
      cancelButtonColor: cancelBtn,
      confirmButtonText: 'Reset',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true)
          await resetPasswordForAdmin(userId)
          Swal.fire({
            text: 'Reset Password successfully',
            icon: 'success',
          })
        } catch (error) {
          Swal.fire({
            text: 'something went wrong',
            icon: 'error',
          })
        } finally {
          setIsLoading(false)
        }
      }
    })
  }
  const rows =
    userList.length > 0 ? (
      userList.map((user) => (
        <Table.Tr
          key={user.userId}
          className="text-base h-16"
          bg={
            selectedRows.includes(user.userId)
              ? 'var(--mantine-color-blue-light)'
              : undefined
          }
        >
          <Table.Td>
            <Checkbox
              aria-label="Select row"
              checked={selectedRows.includes(user.userId)}
              onChange={(event) =>
                handleSelectBox(event.currentTarget.checked, user.userId)
              }
            />
          </Table.Td>
          <Table.Td>{user.userId}</Table.Td>
          <Table.Td onClick={() => openModalUser(user)}>
            {user.avatar ? (
              <Image className={style.avatar} src={user.avatar} />
            ) : (
              <RxAvatar className="ml-1" size={30} />
            )}
          </Table.Td>

          <Table.Td onClick={() => openModalUser(user)}>{user.email}</Table.Td>
          {/* This comment can be use in future. 
          {user.phone ? (
            <Table.Td>{user.phone}</Table.Td>
          ) : (
            <Table.Td>
              <span className="text-base text-[#7B54F4] bg-[#F1EDFE] px-2 rounded-[6px] py-1">
                Not registered
              </span>
            </Table.Td>
          )} 
          {user.roleId === Roles.Seller ? (
            <Table.Td>{Number(user.balance)}</Table.Td>
          ) : (
            <Table.Td>No balance</Table.Td>
          )}
          <Table.Td className="font-semibold">
            {user.roleId === Roles.User
              ? 'User'
              : user.roleId === Roles.Seller
                ? 'Seller'
                : 'Undefined'}
          </Table.Td>*/}
          <Table.Td>{formatDateNoHours(user.createdAt)}</Table.Td>

          <Table.Td>
            <Button
              color="teal"
              onClick={() => handleResetPassword(user.userId)}
            >
              Reset
            </Button>
          </Table.Td>
          <Table.Td>
            {user.isActive ? (
              <Tooltip label="Click to disable" refProp="rootRef">
                <Switch
                  size="md"
                  checked={user.isActive ? true : false}
                  onChange={(event) => {
                    if (user.userId !== undefined) {
                      handleUpdateStatusUser(
                        user.userId,
                        event.currentTarget.checked,
                      )
                    }
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip label="Click to enable" refProp="rootRef">
                <Switch
                  size="md"
                  checked={user.isActive ? true : false}
                  onChange={(event) => {
                    if (user.userId !== undefined) {
                      handleUpdateStatusUser(
                        user.userId,
                        event.currentTarget.checked,
                      )
                    }
                  }}
                />
              </Tooltip>
            )}
          </Table.Td>
          <Table.Td>
            <div className={style.userActions}>
              <FaEdit
                onClick={() => openModalUser(user)}
                className={`${style.actionIcon} ${style.editIcon}`}
              />
              <MdDelete
                onClick={() => handleDeleteUser(user)}
                className={`${style.actionIcon} ${style.deleteIcon}`}
              />
            </div>
          </Table.Td>
        </Table.Tr>
      ))
    ) : (
      <div>There are no registered users yet</div>
    )

  return (
    <>
      <div className="mt-8 flex justify-between">
        <div className={style.searchContainer}>
          <TextInput
            placeholder="Enter email..."
            size="md"
            radius={4}
            classNames={{ input: style.textInput }}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            className={style.iconSearch}
            onClick={() => handleSearchUsers()}
          >
            <FaSearch size={20} />
          </Button>
        </div>

        <div className="flex items-end gap-4 justify-end">
          {/* <Select
                classNames={{
                  root: style.rootSelectActions,
                  label: style.labelSelectActions,
                  input: style.inputSelectActions,
                  dropdown: style.dropdownSelectActions,
                  options: style.optionsSelectActions,
                  option: style.optionSelectActions,
                }}
                placeholder="Filter"
                data={[
                  { value: String(Roles.User), label: 'Filter By User Role' },
                  {
                    value: String(Roles.Seller),
                    label: 'Filter By Seller Role',
                  },
                ]}
                onChange={(value: string | null) => {
                  setRoleId(value)
                }}
                allowDeselect
              /> */}
          <Button
            classNames={{
              root:
                selectedRows.length > 0
                  ? style.rootButtonDeleteAllAfter
                  : style.rootButtonDeleteAll,
            }}
            onClick={() => handleDeleteAllSelectedRows()}
          >
            Delete ({selectedRows.length}) Customers
          </Button>
        </div>
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
                  <Table.Th>
                    <Checkbox
                      checked={allSelected}
                      onChange={() => handleSelectAllSelectedRows()}
                    />
                  </Table.Th>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Avatar</Table.Th>
                  <Table.Th>Email</Table.Th>
                  {/* This comment can be used in future.
                     <Table.Th>Phone</Table.Th> 
                    <Table.Th>Balance</Table.Th>
                    <Table.Th>Role</Table.Th>
                    */}
                  <Table.Th>Created On</Table.Th>
                  <Table.Th>Password</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Action</Table.Th>
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

      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size={820}
        centered
        classNames={{ body: style.bodyModal }}
        radius={16}
      >
        <ModalManageUser
          user={userSelected}
          onClose={close}
          isUpdated={isUpdated}
          setIsUpdated={setIsUpdated}
        />
      </Modal>
    </>
  )
}

export default TableUser
