import React, { useEffect, useState } from 'react'
import style from './TableProperty.module.scss'
import {
  Button,
  Select,
  TextInput,
  Table,
  Image,
  Modal,
  Pagination,
  RangeSlider,
  Text,
  LoadingOverlay,
  Tooltip,
  Switch,
  Checkbox,
} from '@mantine/core'
import {
  FaEdit,
  FaLongArrowAltUp,
  FaSearch,
  FaLongArrowAltDown,
} from 'react-icons/fa'
import { useDisclosure } from '@mantine/hooks'
import ModalProperty from '../ModalProperty/ModalProperty'
import { Category, Feature, Properties } from '@/types'
import { formatMoneyToUSD } from '../../utils/commonFunctions'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getAllCategories } from '../../redux/reducers/categorySlice'
import { getAllFeatures } from '../../redux/reducers/featureSlice'
import { MdDelete } from 'react-icons/md'
import { Province } from '@/types/province'
import { getAllProvinces } from '../../redux/reducers/locationReducer'
import { SearchProps } from '@/types/searchProps'
import {
  getPropertiesForAdminService,
  getAllPropertiesForAdminSerivce,
  updateStatusPropertyForAdminService,
  deletePropertyForAdminService,
  disablePropertyForAdminService,
} from '../../service/AdminService'
import {
  AVAILABLE,
  DISABLED,
  UN_AVAILABLE,
} from '../../constants/statusProperty.constant'
import { optionsFilter } from '../../utils/filterLocation'
import { PiArrowsDownUp } from 'react-icons/pi'
import Swal from 'sweetalert2'
import { cancelBtn, confirmBtn } from '../../constants/color.constant'
import { EDIT_PROP, VIEW_PROP } from '../../constants/actions.constant'
import { getMaxPrice } from '../../service/SearchService'

const TablePropertyAdmin = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedProperty, setSelectedProperty] = useState<Properties | null>(
    null,
  )
  const [isUpdated, setIsUpdated] = useState(false)
  const [properties, setProperties] = useState<Properties[]>([])
  const [featureId, setFeatureId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [keyword, setKeyword] = useState('')
  const [provinceCode, setProvinceCode] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [totalPages, setTotalPages] = useState(2)
  const [totalItems, setTotalItems] = useState(0)
  const [resetPage, setResetPage] = useState(true)
  const [sortBy, setSortBy] = useState('')
  const [orderBy, setOrderBy] = useState('')
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice])
  const [isLoading, setIsLoading] = useState(false)
  const [filterNum, setFilterNum] = useState<number>(0)
  const [resetFilter, setResetFilter] = useState(false)
  const [actionModal, setActionModal] = useState('')
  const [titleModal, setTitleModal] = useState('')

  const dispatch = useAppDispatch()

  const checkNumFilter = () => {
    setFilterNum(0)
    if (keyword) setFilterNum((prev) => prev + 1)
    if (categoryId) setFilterNum((prev) => prev + 1)
    if (featureId) setFilterNum((prev) => prev + 1)
    if (sortBy) setFilterNum((prev) => prev + 1)
    if (provinceCode) setFilterNum((prev) => prev + 1)
    if (priceRange[0] !== 0 || priceRange[1] !== maxPrice) {
      setFilterNum((prev) => prev + 1)
    }
  }
  useEffect(() => {
    checkNumFilter()
  }, [keyword, categoryId, featureId, sortBy, priceRange, provinceCode])

  const handleGetMaxPrice = async () => {
    const res = await getMaxPrice()
    setMaxPrice(res.metaData)
    setPriceRange([0, res.metaData])
  }
  useEffect(() => {
    handleGetMaxPrice()
  }, [])
  const handlePropertyView = (property: Properties) => {
    setSelectedProperty(property)
    setTitleModal('View Detail Property')
    setActionModal(VIEW_PROP)
    open()
  }
  const handlePropertyEdit = (property: Properties) => {
    setSelectedProperty(property)
    setTitleModal('Edit Property')
    setActionModal(EDIT_PROP)
    open()
  }
  const getAllProperties = async () => {
    try {
      const res = await getAllPropertiesForAdminSerivce()
      setProperties(res.metaData.data)
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
    getAllProperties()
  }, [isUpdated])
  const categories: Category[] = useAppSelector(
    (state) => state.category.categoriesList,
  )
  useEffect(() => {
    dispatch(getAllCategories())
  }, [dispatch])

  const features: Feature[] = useAppSelector(
    (state) => state.feature.featuresList,
  )
  useEffect(() => {
    dispatch(getAllFeatures())
  }, [dispatch])

  const handleSearching = async () => {
    const data: SearchProps = {
      keyword: keyword ? keyword : null,
      categoryId: categoryId ? Number(categoryId) : null,
      featureId: featureId ? Number(featureId) : null,
      provinceCode: provinceCode ? provinceCode : null,
      page: activePage ? activePage : null,
      priceFrom: priceRange ? priceRange[0] : null,
      priceTo: priceRange ? priceRange[1] : null,
      sortBy: sortBy ? (sortBy.includes('asc') ? 'desc' : 'asc') : null,
      orderBy: orderBy ? (orderBy.startsWith('p') ? 'price' : null) : null,
    }
    try {
      setIsLoading(true)
      const res = await getPropertiesForAdminService(data)
      setProperties(res.data.metaData.data)
      setTotalPages(res.data.metaData.totalPages)
      setTotalItems(res.data.metaData.totalItems)
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

  useEffect(() => {
    handleSearching()
  }, [
    orderBy,
    sortBy,
    activePage,
    priceRange,
    provinceCode,
    featureId,
    categoryId,
    resetFilter,
  ])

  const provinces: Province[] = useAppSelector(
    (state) => state.location.provincesList,
  )
  useEffect(() => {
    dispatch(getAllProvinces())
  }, [dispatch])

  const _handleChangeStatusProperty = async (
    status: string | null,
    propertyId: number,
  ) => {
    try {
      setIsLoading(true)
      await updateStatusPropertyForAdminService(propertyId, status)
    } catch (error: any) {
      Swal.fire({
        title: error.response.data.error.message,
        icon: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleChangeActivePage = async (page: any) => {
    setResetPage(false)
    setActivePage(page)
    setSelectedRows([])
  }

  const handleResetFilter = () => {
    if (filterNum > 0) {
      setProvinceCode('')
      setKeyword('')
      setFeatureId('')
      setCategoryId('')
      setSortBy('')
      setOrderBy('')
      setActivePage(1)
      setPriceRange([0, maxPrice])
      setSelectedRows([])
      setResetFilter((prev) => !prev)
    }
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      setKeyword(event.currentTarget.value)
      handleSearching()
    }
  }

  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const allSelected = selectedRows.length === properties.length
  const handleSelectBox = (event: boolean, propertyId: number) => {
    if (event) {
      setSelectedRows([...selectedRows, propertyId])
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== propertyId))
    }
  }

  const handleDeleteAllSelectedRows = () => {
    const parseSelectedRowsToString = String(selectedRows)

    Swal.fire({
      text: `Are you sure to delete these properties ID: ${JSON.stringify(parseSelectedRowsToString)}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmBtn,
      cancelButtonColor: cancelBtn,
      confirmButtonText: 'Delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePropertyForAdminService(parseSelectedRowsToString)
          Swal.fire({
            title: 'Deleted!',
            text: 'Your property has been deleted.',
            icon: 'success',
          })
          setSelectedRows([])
          setIsUpdated(!isUpdated)
        } catch (error: any) {
          Swal.fire({
            title: error.response.data.error.message,
            icon: 'error',
          })
        }
      }
    })
  }

  const handleDisabledSelectedProperty = () => {
    const parseSelectedRowsToString = String(selectedRows)
    Swal.fire({
      text: `Are you sure to disable these properties ID: ${JSON.stringify(parseSelectedRowsToString)}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmBtn,
      cancelButtonColor: cancelBtn,
      confirmButtonText: 'Disable',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await disablePropertyForAdminService(parseSelectedRowsToString)
          Swal.fire({
            title: 'Disabled!',
            text: 'Property has been disabled.',
            icon: 'success',
          })
          setIsUpdated((prev) => !prev)
          setSelectedRows([])
        } catch (error: any) {
          Swal.fire({
            title: error.response.data.error.message,
            icon: 'error',
          })
        }
      }
    })
  }

  const handleSelectAllSelectedRows = () => {
    if (allSelected) {
      setSelectedRows([])
    } else {
      const allPropertyIds = properties.map((property) => property.propertyId)
      setSelectedRows(allPropertyIds)
    }
  }

  const hanldeDisableProperty = async (property: Properties) => {
    if (property === null) {
      Swal.fire({
        title: 'Something is wrong',
        icon: 'error',
      })
      return
    }
    Swal.fire({
      text: `Are you sure to disable these properties ID: ${property.propertyId}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmBtn,
      cancelButtonColor: cancelBtn,
      confirmButtonText: 'Disable',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true)
          await disablePropertyForAdminService(String(property.propertyId))
          Swal.fire({
            title: 'Disabled!',
            text: 'Property has been disabled.',
            icon: 'success',
          })
          setSelectedRows(
            selectedRows.filter((element) => element !== property.propertyId),
          )
          setIsUpdated((prev) => !prev)
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
  const handleDelete = async (property: Properties) => {
    Swal.fire({
      text: `Are you sure to delete property ID: ${property.propertyId}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmBtn,
      cancelButtonColor: cancelBtn,
      confirmButtonText: 'Delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePropertyForAdminService(String(property.propertyId))
          Swal.fire({
            title: 'Deleted!',
            text: 'Your property has been deleted.',
            icon: 'success',
          })
          setSelectedRows(
            selectedRows.filter((element) => element !== property.propertyId),
          )
          setIsUpdated(!isUpdated)
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            text: error.response.data.error.message,
          })
        }
      }
    })
  }
  const rows =
    properties.length > 0 &&
    properties.map((element) => (
      <Table.Tr
        onClick={() => handlePropertyView(element)}
        className={style.detailContentTable}
        key={element.propertyId}
        bg={
          selectedRows.includes(element.propertyId)
            ? 'var(--mantine-color-blue-light)'
            : undefined
        }
      >
        <Table.Td onClick={(event) => event.stopPropagation()}>
          <Checkbox
            aria-label="Select row"
            checked={selectedRows.includes(element.propertyId)}
            onChange={(event) =>
              handleSelectBox(event.currentTarget.checked, element.propertyId)
            }
          />
        </Table.Td>
        <Table.Td>{element.propertyId}</Table.Td>
        <Table.Td classNames={{ td: style.tdNameCover }}>
          <div className={style.propertyNameCover}>
            <Image
              className={style.propertyImage}
              src={
                element.images.length > 0
                  ? element.images[0].imageUrl
                  : 'No image'
              }
            />
            <span className={style.propertyName}>{element.name}</span>
          </div>
        </Table.Td>
        <Table.Td>{element.feature.name}</Table.Td>
        <Table.Td>{element.category.name}</Table.Td>
        <Table.Td>{formatMoneyToUSD(element.price)}</Table.Td>
        <Table.Td className="font-semibold">{element.seller.fullName}</Table.Td>

        <Table.Td onClick={(event) => event.stopPropagation()}>
          {/* This comment has been kept as a temporary if there are any errors.
          <Select
            classNames={{
              input: `${element.status === AVAILABLE} ? ${style.inputSelectStatus} : ${style.unavailableSelectStatus}`,
              wrapper: style.wrapperSelectStatus,
            }}
            placeholder="Select status"
            data={[
              { value: AVAILABLE, label: AVAILABLE },
              { value: UN_AVAILABLE, label: UN_AVAILABLE },
              { value: DISABLED, label: DISABLED },
            ]}
            defaultValue={element.status}
            onChange={(value: string | null) =>
              handleChangeStatusProperty(value, element.propertyId)
            }
          /> */}
          {element.status === AVAILABLE ? (
            <div className={style.available}>Available</div>
          ) : element.status === UN_AVAILABLE ? (
            <div className={style.unavailable}>Unavailable</div>
          ) : (
            <div className={style.disabledAdmin}>Disabled</div>
          )}
        </Table.Td>
        <Table.Td onClick={(event) => event.stopPropagation()}>
          <div className={style.propertyActions}>
            {/* This comment has been kept as a temporary if there are any errors.
            <Tooltip label="Disable property">
              <div>
                <GiSightDisabled
                  className={`${style.actionIcon} ${style.disabledIcon}`}
                  size={24}
                />
              </div>
            </Tooltip> */}

            {element.status === DISABLED ? (
              <Tooltip label="Disabled" refProp="rootRef">
                <Switch checked={false} />
              </Tooltip>
            ) : (
              <Tooltip label="Click to disable" refProp="rootRef">
                <Switch
                  checked={true}
                  onChange={() => {
                    hanldeDisableProperty(element)
                  }}
                />
              </Tooltip>
            )}
            <Tooltip label="Edit property">
              <div>
                <FaEdit
                  className={`${style.actionIcon} ${style.editIcon}`}
                  onClick={() => handlePropertyEdit(element)}
                />
              </div>
            </Tooltip>
            <Tooltip label="Delete property">
              <div>
                <MdDelete
                  className={`${style.actionIcon} ${style.deleteIcon}`}
                  onClick={() => handleDelete(element)}
                />
              </div>
            </Tooltip>
          </div>
        </Table.Td>
      </Table.Tr>
    ))

  return (
    <>
      <div className={style.tablePropertyContainer}>
        <div className={style.tablePropertyContent}>
          <div className={style.tableHeader}>
            <div className={style.pageTitle}>
              <span className={style.title}>Property List</span>
              <span className={style.subTitle}>Manage your properties</span>
            </div>
          </div>

          <div className={style.tableSideBar}>
            <div className={style.tableSelectAdmin}>
              <div className={style.firstRowFilterContainer}>
                <TextInput
                  classNames={{ input: style.inputText }}
                  placeholder="Enter your keyword..."
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Select
                  comboboxProps={{ zIndex: 20 }}
                  classNames={{
                    input: style.elementSelect,
                    dropdown: style.dropdownSelectActions,
                    options: style.optionsSelectActions,
                    option: style.optionSelectActions,
                  }}
                  placeholder="Select Featured"
                  data={features.flatMap((feature) => [
                    {
                      value: feature.featureId.toString(),
                      label: feature.name,
                    },
                  ])}
                  onChange={(value: string | null) => {
                    if (value !== null) {
                      setFeatureId(value)
                    } else {
                      setFeatureId('')
                    }
                  }}
                  allowDeselect
                />

                <Select
                  comboboxProps={{ zIndex: 20 }}
                  classNames={{
                    input: style.elementSelect,
                    dropdown: style.dropdownSelectActions,
                    options: style.optionsSelectActions,
                    option: style.optionSelectActions,
                  }}
                  placeholder="Select Category"
                  data={categories.flatMap((category) => [
                    {
                      value: category.categoryId.toString(),
                      label: category.name,
                    },
                  ])}
                  onChange={(value: string | null) => {
                    if (value !== null) {
                      setCategoryId(value)
                    } else {
                      setCategoryId('')
                    }
                  }}
                  allowDeselect
                />
                <Select
                  classNames={{
                    input: style.elementSelect,
                    dropdown: style.dropdownSelectActions,
                    options: style.optionsSelectActions,
                    option: style.optionSelectActions,
                  }}
                  placeholder="Select City/Province"
                  withAsterisk
                  searchable
                  allowDeselect
                  data={provinces.flatMap((prov: Province) => [
                    {
                      value: prov.provinceCode,
                      label: prov.nameEn,
                    },
                  ])}
                  filter={optionsFilter}
                  comboboxProps={{
                    position: 'bottom',
                    offset: 0,
                    transitionProps: { transition: 'pop', duration: 200 },
                    zIndex: 20,
                  }}
                  onChange={(value: string | null) => {
                    if (value !== null) {
                      setProvinceCode(value)
                    } else {
                      setProvinceCode('')
                    }
                  }}
                  defaultValue={provinceCode}
                />
              </div>
              <div className={style.secondRowFilterContainer}>
                <div className={style.priceRangeContainer}>
                  <div className={style.priceRangeChild}>
                    <Text className={style.labelPriceRange}>Price range:</Text>

                    {maxPrice !== 0 && (
                      <RangeSlider
                        classNames={{
                          root: style.rootRangeSlider,
                          label: style.lableRangeSlider,
                        }}
                        color="#396651"
                        minRange={100}
                        min={0}
                        max={maxPrice}
                        step={500}
                        defaultValue={priceRange}
                        onChangeEnd={setPriceRange}
                        labelAlwaysOn
                        label={(value) => `${formatMoneyToUSD(value)}`}
                      />
                    )}
                  </div>
                  <Button
                    className={style.iconSearchAdmin}
                    onClick={() => handleSearching()}
                  >
                    <FaSearch size={16} />
                  </Button>
                  <Button
                    classNames={{
                      root:
                        filterNum > 0
                          ? style.rootBtnClearAfter
                          : style.rootBtnClear,
                    }}
                    onClick={() => {
                      handleResetFilter()
                    }}
                  >
                    Clear Filter {filterNum > 0 && <span>({filterNum})</span>}
                  </Button>
                </div>

                <div className={style.actionsContainer}>
                  <Button
                    classNames={{
                      root:
                        selectedRows.length > 0
                          ? style.rootButtonDeleteAllAfter
                          : style.rootButtonDeleteAll,
                    }}
                    onClick={() => handleDeleteAllSelectedRows()}
                  >
                    Delete ({selectedRows.length}) properties
                  </Button>
                  <Button
                    classNames={{
                      root:
                        selectedRows.length > 0
                          ? style.rootButtonDeleteAllAfter
                          : style.rootButtonDeleteAll,
                    }}
                    onClick={() => handleDisabledSelectedProperty()}
                  >
                    Disable ({selectedRows.length}) properties
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* This comment has been kept as a temporary if there are any changes about UI.
           <div className="flex items-end gap-4 mt-4 justify-end">
            <Select
            comboboxProps={{ zIndex: 20 }}
              classNames={{
                root: style.rootSelectActions,
                label: style.labelSelectActions,
                input: style.inputSelectActions,
                dropdown: style.dropdownSelectActions,
                options: style.optionsSelectActions,
                option: style.optionSelectActions,
              }}
              label="Actions:"
              placeholder="Choose Actions"
              data={[
                { value: 'delete', label: 'Delete Property' },
                { value: 'disable', label: 'Disable Property' },
              ]}
              onChange={(value: string | null) => {
                setAction(value)
              }}
              allowDeselect
            />
            <Button
              classNames={{ root: style.rootApplyBtn }}
              onClick={() => handleDeleteAllSelectedRows()}
            >
              Apply
            </Button>
          </div> */}
          <div className={style.tableContent}>
            <Table.ScrollContainer minWidth={500}>
              <Table
                className="relative"
                bg="white"
                highlightOnHover
                withTableBorder
                verticalSpacing="sm"
                stickyHeader
              >
                <Table.Thead>
                  <Table.Tr className={style.titleTable}>
                    <Table.Th>
                      <Checkbox
                        checked={allSelected}
                        onChange={() => handleSelectAllSelectedRows()}
                      />
                    </Table.Th>
                    <Table.Th>ID</Table.Th>
                    <Table.Th classNames={{ th: style.thName }}>
                      Property Name
                    </Table.Th>
                    <Table.Th>Featured</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th classNames={{ th: style.thPrice }}>
                      <span>Price</span>
                      <span
                        className={style.iconSortTh}
                        onClick={() => {
                          setOrderBy('price')
                          setSortBy(sortBy.includes('asc') ? 'desc' : 'asc')
                        }}
                      >
                        {sortBy ? (
                          sortBy === 'desc' ? (
                            <FaLongArrowAltUp />
                          ) : (
                            <FaLongArrowAltDown />
                          )
                        ) : (
                          <PiArrowsDownUp
                            className="cursor-pointer"
                            size={20}
                          />
                        )}
                      </span>
                    </Table.Th>
                    <Table.Th>Seller</Table.Th>
                    <Table.Th className="min-w-30">Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <LoadingOverlay
                  visible={isLoading}
                  zIndex={10}
                  overlayProps={{ radius: 'sm', blur: 2 }}
                  loaderProps={{ color: 'pink', type: 'bars' }}
                />
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </div>

          <div className={style.pagination}>
            <Pagination
              total={totalPages}
              value={activePage}
              onChange={handleChangeActivePage}
              mt="sm"
              classNames={{ control: style.paginationControl }}
            />
            <div className={style.totalItems}>Result: {totalItems}</div>
          </div>
        </div>
      </div>
      <Modal
        opened={opened}
        onClose={() => {
          close()
          setSelectedProperty(null)
        }}
        size={1280}
        title={titleModal}
        classNames={{
          header: style.headerModal,
          title: style.titleModal,
          body: style.bodyModal,
          content: style.contentModal,
        }}
      >
        <ModalProperty
          property={selectedProperty}
          onClose={close}
          isUpdated={setIsUpdated}
          action={actionModal}
        />
      </Modal>
    </>
  )
}
export default TablePropertyAdmin
