import React, { useEffect, useState } from 'react'
import { Button, Select, TextInput } from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react'
import styles from './TextSearchBar.module.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setIsSmallScreen } from '../../redux/reducers/resizeSlice'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { FOR_RENT } from '../../constants/category.constant'

export default function TextSearchBar() {
  const dispatch = useAppDispatch()
  const isSmallScreen = useAppSelector((state) => state.resize.isSmallScreen)
  const [searchValue, setSearchValue] = useState('')
  const [featureValue, setFeatureValue] = useState<string | null>('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const navigate = useNavigate()
  const params = {
    keyword: searchValue,
    featureId: featureValue ? (featureValue === FOR_RENT ? '2' : '1') : '',
  }

  const handleSearch = () => {
    navigate({
      pathname: '/search',
      search: `?${createSearchParams(params)}`,
    })
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') handleSearch()
  }

  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsSmallScreen(window.innerWidth < 600))
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      setFeatureValue('')
    }
  }, [dispatch])
  const leftSection = (
    <Button
      onClick={handleSearch}
      className="px-3 bg-transparent hover:bg-transparent"
    >
      <IconSearch className={styles.icon} size={30} />
    </Button>
  )

  const rightSection = (
    <Select
      onDropdownOpen={() => setDropdownOpen(true)}
      onDropdownClose={() => setDropdownOpen(false)}
      checkIconPosition="right"
      variant="unstyled"
      size={isSmallScreen ? 'sm' : 'md'}
      className={styles.selectOption}
      classNames={{
        input: styles.selectInput,
        option: 'hover:bg-blur',
        dropdown: isSmallScreen ? 'mt-0 w-[100%]' : 'mt-2 w-[100%]',
        wrapper: styles.selectOption,
        section: 'mr-2',
      }}
      comboboxProps={{ zIndex: 2 }}
      placeholder="Feature"
      data={['For Rent', 'For Sale']}
      rightSection={
        dropdownOpen ? (
          <IconChevronUp className=" lg:ml-28 mobile:ml-24" />
        ) : (
          <IconChevronDown className=" lg:ml-28 mobile:ml-24" />
        )
      }
      onChange={(value) => setFeatureValue(value)}
    />
  )

  return (
    <>
      <TextInput
        radius={isSmallScreen ? 'md' : 'lg'}
        rightSectionWidth={isSmallScreen ? 105 : 140}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        className=" cursor-pointer rounded-none text-primary"
        size={isSmallScreen ? 'md' : 'xl'}
        leftSection={leftSection}
        rightSection={rightSection}
        placeholder="Search here..."
        classNames={{
          wrapper: styles.wrapper,
          input: styles.input,
          
        }}
        value={searchValue}
      />
    </>
  )
}
