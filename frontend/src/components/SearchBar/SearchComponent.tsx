import React, { useState, useEffect } from 'react'
import {
  Select,
  RangeSlider,
  TextInput,
  Button,
  Pagination,
  Text,
  Divider,
  Drawer,
  LoadingOverlay,
} from '@mantine/core'
import styles from './SearchComponent.module.scss'
import {
  useFetchProvincesQuery,
  useFetchDistrictsQuery,
  useFetchWardsQuery,
} from '../../redux/reducers/locationSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'

import {
  IconMapPin,
  IconMeterSquare,
  IconMapCheck,
  IconMapPins,
  IconBed,
  IconBath,
  IconHome,
  IconTexture,
  IconSearch,
  IconAdjustmentsHorizontal,
  IconArrowsSort,
} from '@tabler/icons-react'
import CustomSelect from './CustomSelect'
import { getMaxPrice, searchProperty } from '../../service/SearchService'
import PropertyCard from '../Properties/PropertyCard'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Properties } from '../../types/properties'
import { setIsSmallScreen } from '../../redux/reducers/resizeSlice'
import { formatMoneyToUSD } from '../../utils/commonFunctions'

export default function SearchComponent() {
  const [flag, setFlag] = useState(false) // to make sure initial call of setRangeValue not recall api
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [opened, { open, close }] = useDisclosure(false)
  const [isLoading, setIsLoading] = useState(false)
  const isSmallScreen = useAppSelector((state) => state.resize.isSmallScreen)
  const dispatch = useAppDispatch()

  const [activePage, setActivePage] = useState(1)
  const [resetActivePage, setResetActivePage] = useState(true)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [properties, setProperties] = useState<Properties[]>([])

  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice])

  const { data: provinces = [] } = useFetchProvincesQuery()

  const [provinceCode, setProvinceCode] = useState(
    searchParams.get('provinceCode') ?? '',
  )
  const [openProvince, setOpenProvince] = useState(false)

  const { data: districts = [] } = useFetchDistrictsQuery(provinceCode, {
    skip: !provinceCode,
  })
  const [districtCode, setDistrictCode] = useState<string>(
    searchParams.get('districtCode') ?? '',
  )
  const [openDistrict, setOpenDistrict] = useState(false)

  const { data: wards = [] } = useFetchWardsQuery(districtCode, {
    skip: !provinceCode || !districtCode,
  })
  const [wardCode, setWardCode] = useState<string>(
    searchParams.get('wardCode') ?? '',
  )
  const [openWard, setOpenWard] = useState(false)

  const [bedNum, setBedNum] = useState<[string, string] | null>(
    searchParams.get('numberOfBedRoomFrom') ||
      searchParams.get('numberOfBedRoomTo')
      ? [
          searchParams.get('numberOfBedRoomFrom') || '',
          searchParams.get('numberOfBedRoomTo') || '',
        ]
      : null,
  )
  const [openBedNum, setOpenBedNum] = useState(false)

  const [bathNum, setBathNum] = useState<[string, string] | null>(
    searchParams.get('numberOfToiletFrom') ||
      searchParams.get('numberOfToiletTo')
      ? [
          searchParams.get('numberOfToiletFrom') || '',
          searchParams.get('numberOfToiletTo') || '',
        ]
      : null,
  )
  const [openBathNum, setOpenBathNum] = useState(false)

  const categories = useAppSelector((state) => state.category.categoriesList)
  const [categoryNum, setCategoryNum] = useState<string[]>(
    searchParams.get('categoryId')
      ? decodeURIComponent(searchParams.get('categoryId')!).split(',')
      : [],
  )
  const [openCategory, setOpenCategory] = useState(false)

  const features = useAppSelector((state) => state.feature.featuresList)
  const [featureNum, setFeatureNum] = useState<string[]>(
    searchParams.get('featureId')
      ? decodeURIComponent(searchParams.get('featureId')!).split(',')
      : [],
  )
  const [openFeature, setOpenFeature] = useState(false)

  const [areaNum, setAreaNum] = useState<[string, string] | null>(
    searchParams.get('landAreaFrom') || searchParams.get('landAreaTo')
      ? [
          searchParams.get('landAreaFrom') || '',
          searchParams.get('landAreaTo') || '',
        ]
      : null,
  )

  const [openAreaNum, setOpenAreaNum] = useState(false)
  const [sortBy, setSortBy] = useState('ASC')
  const [numOfFilters, setNumOfFilters] = useState(0)

  const [searchValue, setSearchValue] = useState(
    searchParams.get('keyword') ?? '',
  )

  const [tempSearchValue, setTempSearchValue] = useState(searchValue)

  const provinceFlatMap = provinces.flatMap((item) => [
    {
      key: item.nameEn,
      value: item.provinceCode,
    },
  ])
  const districtFlatMap = provinceCode
    ? districts.flatMap((item) => [
        {
          key: item.nameEn,
          value: item.districtCode,
        },
      ])
    : []
  const wardFlatMap = districtCode
    ? wards.flatMap((item) => [
        {
          key: item.nameEn,
          value: item.wardCode,
        },
      ])
    : []

  const bedAndBathFlapMap = [
    { key: '1 - 2', value: ['1', '2'] },
    { key: '3 - 4', value: ['3', '4'] },
    { key: '5 - 6', value: ['5', '6'] },
    { key: '7 - 8', value: ['7', '8'] },
    { key: '8+', value: ['8', '100'] },
  ]

  const areaFlapMap = [
    { key: '30m² - 50m²', value: ['30', '50'] },
    { key: '50m² - 70m²', value: ['50', '70'] },
    { key: '70m² - 90m²', value: ['70', '90'] },
    { key: '90m² - 120m²', value: ['90', '120'] },
    { key: '120m² - above', value: ['120', '1000'] },
  ]
  const categoryFlatMap = categories.flatMap((item) => [
    {
      key: item.name,
      value: String(item.categoryId),
    },
  ])
  const featureFlatMap = features.flatMap((item) => [
    {
      key: item.name,
      value: String(item.featureId),
    },
  ])

  const handleCheckNumOfFilter = () => {
    setNumOfFilters(0)
    if (searchParams.get('provinceCode')) setNumOfFilters((prev) => prev + 1)
    if (searchParams.get('districtCode')) setNumOfFilters((prev) => prev + 1)
    if (searchParams.get('wardCode')) setNumOfFilters((prev) => prev + 1)
    if (searchParams.get('numberOfBedRoomTo'))
      setNumOfFilters((prev) => prev + 1)
    if (searchParams.get('numberOfToiletTo'))
      setNumOfFilters((prev) => prev + 1)
    if (searchParams.get('landAreaTo')) setNumOfFilters((prev) => prev + 1)
    if (searchParams.get('categoryId'))
      setNumOfFilters(
        (prev) =>
          prev +
          decodeURIComponent(searchParams.get('categoryId')!).split(',').length,
      )
    if (searchParams.get('featureId'))
      setNumOfFilters(
        (prev) =>
          prev +
          decodeURIComponent(searchParams.get('featureId')!).split(',').length,
      )
    if (priceRange[0] !== 0 || priceRange[1] !== maxPrice)
      setNumOfFilters((prev) => prev + 1)
  }

  const handleResetFilter = () => {
    setProvinceCode((_prev) => '')
    setDistrictCode((_prev) => '')
    setWardCode((_prev) => '')
    setBedNum((_prev) => null)
    setBathNum((_prev) => null)
    setAreaNum((_prev) => null)
    setCategoryNum((_prev) => [])
    setFeatureNum((_prev) => [])
    setPriceRange((_prev) => [0, maxPrice])
    setSortBy((_prev) => 'ASC')
  }

  const handleGetMaxPrice = async () => {
    const res = await getMaxPrice()
    setMaxPrice(res.metaData)
    setFlag(true)
    setPriceRange([0, res.metaData])
  }

  const handleSubmitSearch = async () => {
    const searchValues = {
      provinceCode: searchParams.get('provinceCode') ?? null,
      districtCode: searchParams.get('districtCode') ?? null,
      wardCode: searchParams.get('wardCode') ?? null,
      featureId: searchParams.get('featureId')
        ? searchParams.get('featureId')
        : null,
      categoryId: searchParams.get('categoryId')
        ? searchParams.get('categoryId')
        : null,
      landAreaFrom: searchParams.get('landAreaFrom')
        ? Number(searchParams.get('landAreaFrom'))
        : null,
      landAreaTo: searchParams.get('landAreaTo')
        ? Number(searchParams.get('landAreaTo'))
        : null,
      numberOfBedRoomFrom: searchParams.get('numberOfBedRoomFrom')
        ? Number(searchParams.get('numberOfBedRoomFrom'))
        : null,
      numberOfBedRoomTo: searchParams.get('numberOfBedRoomTo')
        ? Number(searchParams.get('numberOfBedRoomTo'))
        : null,
      numberOfToiletFrom: searchParams.get('numberOfToiletFrom')
        ? Number(searchParams.get('numberOfToiletFrom'))
        : null,
      numberOfToiletTo: searchParams.get('numberOfToiletTo')
        ? Number(searchParams.get('numberOfToiletTo'))
        : null,
      priceFrom: searchParams.get('priceFrom')
        ? Number(searchParams.get('priceFrom'))
        : null,
      priceTo: searchParams.get('priceTo')
        ? Number(searchParams.get('priceTo'))
        : null,
      orderBy: sortBy.startsWith('P') ? 'price' : 'createdAt',
      sortBy: sortBy.startsWith('P') ? sortBy.slice(1, sortBy.length) : sortBy,
      keyword: tempSearchValue ? tempSearchValue : null,
      page: resetActivePage ? 1 : activePage,
    }

    try {
      setIsLoading(true)
      const data = await searchProperty(searchValues)
      setIsLoading(false)
      setProperties((_prev) => data.data)
      setTotalPages(data.totalPages)
      setTotalItems(data.totalItems)
      setActivePage(resetActivePage ? 1 : activePage)
      setResetActivePage(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error: any) {
      console.error(error.response.data.error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeActivePage = async (page: any) => {
    setResetActivePage(false)
    setActivePage((_prev) => page)
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      setSearchValue(event.currentTarget.value)
      searchParams.set('keyword', event.currentTarget.value)
      navigate({
        search: searchParams.toString(),
      })
    }
  }

  useEffect(() => {
    handleGetMaxPrice()
  }, [])

  useEffect(() => {
    setDistrictCode('')
    setWardCode('')
  }, [provinceCode])

  useEffect(() => {
    setWardCode('')
  }, [districtCode])

  useEffect(() => {
    if (flag) {
      setFlag(false)
      return
    }

    let searchValues = {}
    if (priceRange[1] !== 0) {
      if (featureNum && featureNum.length > 0)
        searchValues = { ...searchValues, featureId: featureNum.join(',') }
      if (categoryNum && categoryNum.length > 0)
        searchValues = { ...searchValues, categoryId: categoryNum.join(',') }
      if (provinceCode)
        searchValues = { ...searchValues, provinceCode: provinceCode }
      if (districtCode)
        searchValues = { ...searchValues, districtCode: districtCode }
      if (wardCode) searchValues = { ...searchValues, wardCode: wardCode }
      if (areaNum)
        searchValues = {
          ...searchValues,
          landAreaFrom: areaNum ? areaNum[0] : '',
        }
      if (areaNum)
        searchValues = {
          ...searchValues,
          landAreaTo: areaNum ? areaNum[1] : '',
        }
      if (bedNum) {
        searchValues = {
          ...searchValues,
          numberOfBedRoomFrom: bedNum ? bedNum[0] : '',
        }
        searchValues = {
          ...searchValues,
          numberOfBedRoomTo: bedNum ? bedNum[1] : '',
        }
      }
      if (bathNum) {
        searchValues = {
          ...searchValues,
          numberOfToiletFrom: bathNum ? bathNum[0] : '',
        }
        searchValues = {
          ...searchValues,
          numberOfToiletTo: bathNum ? bathNum[1] : '',
        }
      }
      if (priceRange[0] !== 0 || priceRange[1] !== maxPrice) {
        searchValues = {
          ...searchValues,
          priceFrom: priceRange ? priceRange[0].toString() : '',
          priceTo: priceRange ? priceRange[1].toString() : '',
        }
      }
      if (sortBy !== 'ASC') {
        searchValues = {
          ...searchValues,
          orderBy: sortBy.startsWith('P') ? 'price' : 'createdAt',
          sortBy: sortBy.startsWith('P')
            ? sortBy.slice(1, sortBy.length)
            : sortBy,
        }
      }
      if (tempSearchValue) {
        searchValues = { ...searchValues, keyword: tempSearchValue }
      }
      if (resetActivePage) {
        searchValues = { ...searchValues, page: 1 }
      } else {
        searchValues = { ...searchValues, page: activePage }
      }

      if (
        !resetActivePage &&
        activePage === 1 &&
        searchValues &&
        'page' in searchValues
      ) {
        delete searchValues.page
      }

      setSearchParams((_prev) => searchValues)
    }
  }, [
    activePage,
    provinceCode,
    districtCode,
    wardCode,
    bedNum,
    bathNum,
    areaNum,
    categoryNum,
    featureNum,
    sortBy,
    priceRange,
  ])

  useEffect(() => {
    setFeatureNum((_prev) =>
      searchParams.get('featureId')
        ? searchParams.get('featureId')!.split(',')
        : [],
    )
    setCategoryNum((_prev) =>
      searchParams.get('categoryId')
        ? searchParams.get('categoryId')!.split(',')
        : [],
    )
    handleSubmitSearch()
    handleCheckNumOfFilter()
  }, [searchParams, setSearchParams])

  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsSmallScreen(window.innerWidth < 1024))
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dispatch])

  const SharedComponents = () => (
    <>
      <Divider mb="sm" />

      <CustomSelect
        dataList={featureFlatMap}
        checkBoxValue={featureNum}
        setCheckBoxValue={setFeatureNum}
        icon={<IconTexture></IconTexture>}
        placeHolder="For Rent/Sale"
        customStyle={true}
        radio={false}
        isRadioRange={false}
        open={openFeature}
        setOpen={setOpenFeature}
      />
      <Divider my="sm" />
      <CustomSelect
        checkBoxValue={categoryNum}
        setCheckBoxValue={setCategoryNum}
        dataList={categoryFlatMap}
        icon={<IconHome></IconHome>}
        placeHolder="Category"
        customStyle={true}
        radio={false}
        isRadioRange={false}
        open={openCategory}
        setOpen={setOpenCategory}
      />
      <Divider my="sm" />
      <div className=" flex flex-col ">
        <CustomSelect
          selectValue={provinceCode}
          dataList={provinceFlatMap}
          setSelectValue={setProvinceCode}
          icon={<IconMapCheck></IconMapCheck>}
          placeHolder="Province"
          open={openProvince}
          setOpen={setOpenProvince}
        />
        <Divider my="sm" />
        <CustomSelect
          selectValue={districtCode}
          dataList={districtFlatMap}
          setSelectValue={setDistrictCode}
          icon={<IconMapPins></IconMapPins>}
          placeHolder="District"
          open={openDistrict}
          setOpen={setOpenDistrict}
        />
        <Divider my="sm" />
        <CustomSelect
          selectValue={wardCode}
          dataList={wardFlatMap}
          setSelectValue={setWardCode}
          icon={<IconMapPin></IconMapPin>}
          placeHolder="Ward"
          open={openWard}
          setOpen={setOpenWard}
        />
      </div>

      <Divider my="sm" />

      <CustomSelect
        rangeValue={bedNum!}
        dataList={bedAndBathFlapMap}
        setRangeValue={setBedNum}
        icon={<IconBed></IconBed>}
        placeHolder="Bed"
        radio={true}
        customStyle={true}
        isRadioRange={true}
        open={openBedNum}
        setOpen={setOpenBedNum}
      />

      <Divider my="sm" />
      <CustomSelect
        rangeValue={bathNum!}
        dataList={bedAndBathFlapMap}
        setRangeValue={setBathNum}
        icon={<IconBath></IconBath>}
        placeHolder="Bath"
        radio={true}
        customStyle={true}
        isRadioRange={true}
        open={openBathNum}
        setOpen={setOpenBathNum}
      />
      <Divider my="sm" />
      <CustomSelect
        rangeValue={areaNum!}
        dataList={areaFlapMap}
        setRangeValue={setAreaNum}
        icon={<IconMeterSquare></IconMeterSquare>}
        placeHolder="Area"
        radio={true}
        customStyle={true}
        isRadioRange={true}
        open={openAreaNum}
        setOpen={setOpenAreaNum}
      />

      <Divider mb="lg" mt="sm" />
      <div className={styles.priceRangeBlock}>
        <small className=" text-primary">Price: </small>
        <RangeSlider
          draggable
          classNames={{ label: styles.label }}
          w="100%"
          color="#396651"
          minRange={0}
          min={0}
          max={maxPrice}
          step={500}
          defaultValue={priceRange}
          onChangeEnd={setPriceRange}
          labelAlwaysOn
          label={(value) => `${formatMoneyToUSD(Math.round(value))}`}
        />
      </div>
    </>
  )

  const SharedButton = () => (
    <>
      <Button
        disabled={isSmallScreen ? false : true}
        leftSection={<IconAdjustmentsHorizontal />}
        variant="outline"
        className={` ${isSmallScreen ? 'cursor-pointer' : 'cursor-default'} lg:w-[150px] bg-transparent  hover:text-primary mobile:w-full h-[50px] rounded-none border-primary text-primary`}
        onClick={open}
      >
        Filter
        {numOfFilters > 0 && <span className="ml-1">({numOfFilters})</span>}
      </Button>

      <Button
        disabled={numOfFilters > 0 ? false : true}
        className="w-[100px] h-[50px] bg-transparent hover:bg-transparent text-primary font-bold px-0 rounded-none
         hover:text-clearFilters mobile:hidden lg:block"
        onClick={handleResetFilter}
      >
        Clear Filters
      </Button>
    </>
  )

  return (
    <>
      <div className={styles.gridInputArea}>
        <div className=" mobile:col-span-12  mobile:block lg:hidden flex justify-center">
          <TextInput
            value={tempSearchValue}
            onChange={(event) => setTempSearchValue(event.currentTarget.value)}
            leftSection={<IconSearch className=" text-primary"></IconSearch>}
            placeholder="Search Here..."
            size="md"
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.gridInputAreaLeft}>
          <div className=" grid mobile:grid-cols-2 lg:grid-cols-1  items-center justify-end gap-x-3 mt-5">
            <div className=" mobile:col-span-1 lg:col-span-2">
              <SharedButton />
            </div>
            <Select
              className="col-span-1 lg:hidden mobile:block "
              classNames={{
                label: 'text-sm',
                input:
                  'h-[50px] rounded-none border-primary text-primary text-sm font-semibold',
              }}
              size="md"
              leftSection={<IconArrowsSort className=" text-primary" />}
              allowDeselect={false}
              checkIconPosition="right"
              placeholder="Sort By"
              value={sortBy}
              data={[
                { label: 'Date Ascending', value: 'ASC' },
                { label: 'Date Descending', value: 'DESC' },
                { label: 'Price Ascending', value: 'PASC' },
                { label: 'Price Descending', value: 'PDESC' },
              ]}
              onChange={(_value: any) => setSortBy(_value)}
            />
          </div>
        </div>
        <div className={styles.gridInputAreaRight}>
          <div className={styles.gridInputAreaRightInner}>
            <div className={styles.gridInputAreaRightInnerLeft}>
              <TextInput
                className=" mobile:hidden lg:block xl:w-3/5 lg:w-2/3 mobile:w-auto"
                value={tempSearchValue}
                onChange={(event) =>
                  setTempSearchValue(event.currentTarget.value)
                }
                leftSection={
                  <IconSearch className=" text-primary"></IconSearch>
                }
                placeholder="Search Here..."
                size="md"
                onKeyDown={handleKeyDown}
              />

              <Select
                className=" lg:block mobile:hidden"
                classNames={{ label: 'text-sm' }}
                label="Sort By"
                size="md"
                leftSection={<IconArrowsSort className=" text-primary" />}
                allowDeselect={false}
                checkIconPosition="right"
                placeholder="Sort By"
                value={sortBy}
                data={[
                  { label: 'Date Ascending', value: 'ASC' },
                  { label: 'Date Descending', value: 'DESC' },
                  { label: 'Price Ascending', value: 'PASC' },
                  { label: 'Price Descending', value: 'PDESC' },
                ]}
                onChange={(_value: any) => setSortBy(_value)}
              />
            </div>
            <div className={styles.gridInputAreaRightInnerRight}>
              <p className=" font-bold text-primary lg:mb-3 mobile:mb-0">
                {totalItems} Results
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.gridInputArea2}>
        <div className={styles.gridCustomSelectArea}>
          <Drawer
            opened={opened}
            onClose={close}
            size="80%"
            position="right"
            className=" mobile:block lg:hidden"
            padding="lg"
          >
            <div className=" flex items-center justify-center mb-5">
              <Button
                disabled
                leftSection={<IconAdjustmentsHorizontal />}
                variant="outline"
                className=" w-[150px] hover:bg-transparent h-[50px] rounded-none border-primary text-primary"
              >
                Filter
                {numOfFilters > 0 && (
                  <span className="ml-1">({numOfFilters})</span>
                )}
              </Button>
              <Button
                disabled={numOfFilters > 0 ? false : true}
                className="w-[100px] bg-transparent hover:bg-transparent hover:text-clearFilters  h-[50px] font-bold px-0 rounded-none text-primary"
                onClick={handleResetFilter}
              >
                Clear Filters
              </Button>
            </div>
            <SharedComponents />
            <div className=" flex justify-center mt-7">
              <Button
                onClick={close}
                size="md"
                w={'80%'}
                className=" bg-orangeBtn text-white"
              >
                Done
              </Button>
            </div>
          </Drawer>

          {/* in normal screen */}
          <div className=" lg:block mobile:hidden">
            <SharedComponents />
          </div>
        </div>

        <div className={styles.paginationAreaOrNoContent}>
          {totalItems === 0 ? (
            <div className={styles.noContentArea}>
              <LoadingOverlay
                loaderProps={{ size: 'xl', color: 'pink', type: 'bars' }}
                classNames={{
                  loader: 'absolute top-20 ',
                  overlay: ' opacity-90',
                }}
                visible={isLoading}
                zIndex={2}
              />
              <Text className=" lg:text-3xl mobile:text-[16px] font-bold truncate line-clamp-1 text-ellipsis">
                We couldn&apos;t find anything that quite matches your search.
              </Text>
              {searchValue && (
                <Text className="lg:text-xl mobile:text-sm w-[80%] text-center font-bold truncate line-clamp-1 text-ellipsis">
                  &quot;{searchValue}&quot;
                </Text>
              )}
              <Text className=" lg:text-lg mobile:text-xs font-bold">
                Try adjusting your search. Here are some ideas:
              </Text>
              <ul className="list-disc lg:text-lg mobile:text-xs">
                <li>Make sure all words are spelled correctly</li>
                <li>Try different search terms</li>
                <li>Try more general search terms</li>
              </ul>
            </div>
          ) : (
            <div className={styles.paginationArea}>
              <LoadingOverlay
                loaderProps={{ size: 'xl', color: 'pink', type: 'bars' }}
                classNames={{
                  loader: 'absolute top-20 ',
                  overlay: ' opacity-90',
                }}
                visible={isLoading}
                zIndex={2}
              />
              <div className={styles.propertyStyle}>
                {properties.length > 0 &&
                  properties.map((el, index) => (
                    <PropertyCard key={index} data={el} />
                  ))}
              </div>

              <Pagination
                classNames={{ control: styles.paginationControl }}
                total={totalPages}
                value={activePage}
                onChange={handleChangeActivePage}
                mt="sm"
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
