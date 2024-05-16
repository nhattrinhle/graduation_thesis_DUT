import React, { useRef, useState, useEffect } from 'react'
import {
  ScrollArea,
  TextInput,
  UnstyledButton,
  Box,
  Text,
  Collapse,
  Group,
  Checkbox,
  Radio,
} from '@mantine/core'

import { IconChevronDown, IconChevronUp, IconCheck } from '@tabler/icons-react'
import styles from './CustomerSelect.module.scss'

interface KVObj {
  key: string
  value: string
}
interface RadioKVObj {
  key: string
  value: string[]
}

interface SearchBarProps {
  dataList: (KVObj | RadioKVObj)[]
  selectValue?: string
  setSelectValue?: (value: string) => void
  rangeValue?: [string, string]
  setRangeValue?: (value: [string, string]) => void
  checkBoxValue?: string[]
  setCheckBoxValue?: (value: string[]) => void
  icon: JSX.Element
  placeHolder: string
  radio?: boolean
  isRadioRange?: boolean
  customStyle?: boolean
  open: boolean
  setOpen: (value: boolean) => void
}

export default function CustomSelect({
  dataList,
  selectValue,
  setSelectValue,
  rangeValue,
  setRangeValue,
  checkBoxValue,
  setCheckBoxValue,
  icon,
  placeHolder,
  radio,
  isRadioRange,
  customStyle,
  open,
  setOpen,
}: SearchBarProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState<string>('')
  const [inputValue, setInputValue] = useState(selectValue)

  const [hovered, setHovered] = useState(-1)

  const [selectedKey, setSelectedKey] = useState('')

  const toggleDropdown = () => setOpen(!open)

  const IconElement = React.cloneElement(icon, {
    onClick: toggleDropdown,
    className: 'cursor-pointer text-primary',
  })

  const filtered = dataList.filter((item) =>
    item.key.toLowerCase().includes(query.toLowerCase()),
  )

  const findKeyByValue = (value: string) => {
    const temp = dataList.find((el) => el.value === value)
    return temp ? temp.key : ''
  }

  const items = filtered.map((item, index) => (
    <UnstyledButton
      data-list-item
      key={item.key}
      value={item.value}
      display="block"
      bg={index === hovered ? 'var(--mantine-color-blue-light)' : undefined}
      w="100%"
      p={5}
    >
      {item.key}
    </UnstyledButton>
  ))

  const handleItemClick = (key: any, value: any) => {
    // this works as deselect.
    if (selectedKey === key) {
      setInputValue('')
      setSelectedKey('')
      setSelectValue!('')
    } else {
      setInputValue(key)
      setSelectedKey(key)
      setSelectValue!(value)
    }
    setOpen(true)
    setQuery('')
  }

  const handleChooseStyle = (placeHolder: string, value?: any) => {
    if (
      (placeHolder === 'Province' ||
        placeHolder === 'District' ||
        placeHolder === 'Ward') &&
      value &&
      value.length > 0
    ) {
      return styles.noCursor
    } else if (
      (placeHolder === 'Province' ||
        placeHolder === 'District' ||
        placeHolder === 'Ward') &&
      !value
    ) {
      return styles.noCursorInput
    } else
      return value && value.length > 0
        ? styles.customTextInput
        : styles.textInput
  }

  useEffect(() => {
    if (selectedKey) {
      setInputValue(selectedKey)
    }
  }, [selectedKey])

  useEffect(() => {
    setSelectedKey(selectValue ? findKeyByValue(selectValue) : '')
  }, [selectValue, dataList])

  return (
    <>
      <div className="">
        <TextInput
          className={
            selectValue ||
            rangeValue ||
            (checkBoxValue && checkBoxValue.length > 0)
              ? `font-extrabold`
              : ''
          }
          size="md"
          variant="unstyled"
          readOnly={customStyle ? true : false}
          classNames={{
            input: handleChooseStyle(
              placeHolder,
              selectValue || rangeValue || checkBoxValue,
            ),
          }}
          leftSection={IconElement}
          rightSection={
            open ? (
              <IconChevronUp
                onClick={() => setOpen(false)}
                size={17}
                className="cursor-pointer"
              ></IconChevronUp>
            ) : (
              <IconChevronDown
                onClick={() => setOpen(true)}
                size={17}
                className="cursor-pointer"
              ></IconChevronDown>
            )
          }
          value={inputValue ?? ''}
          onClick={() => (customStyle ? setOpen(!open) : setOpen(true))}
          onChange={(event) => {
            setOpen(true)
            setInputValue(event.currentTarget.value)
            setQuery(event.currentTarget.value)
            setHovered(-1)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setHovered((current) => {
                const nextIndex =
                  current + 1 >= filtered.length ? current : current + 1
                viewportRef.current
                  ?.querySelectorAll('[data-list-item]')
                  ?.[nextIndex]?.scrollIntoView({ block: 'nearest' })
                return nextIndex
              })
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setHovered((current) => {
                const nextIndex = current - 1 < 0 ? current : current - 1
                viewportRef.current
                  ?.querySelectorAll('[data-list-item]')
                  ?.[nextIndex]?.scrollIntoView({ block: 'nearest' })
                return nextIndex
              })
            }
          }}
          placeholder={placeHolder}
        />

        <Collapse in={open}>
          {customStyle ? (
            radio ? (
              <>
                <Radio.Group
                  value={
                    isRadioRange ? JSON.stringify(rangeValue) : selectValue
                  }
                  onChange={(value) => {
                    if (isRadioRange) {
                      const newValue = JSON.parse(value)
                      setRangeValue!(newValue)
                    }
                    if (!isRadioRange) {
                      setSelectValue!(value)
                    }
                  }}
                >
                  <Group
                    mt="xs"
                    className="flex flex-col justify-center items-start pl-2"
                  >
                    {dataList.map((data) => (
                      <Radio
                        key={data.key}
                        value={
                          isRadioRange ? JSON.stringify(data.value) : data.value
                        }
                        label={data.key}
                      />
                    ))}
                  </Group>
                </Radio.Group>
              </>
            ) : (
              <>
                <Checkbox.Group
                  value={checkBoxValue}
                  onChange={setCheckBoxValue}
                >
                  <Group
                    mt="xs"
                    className="flex flex-col justify-center items-start pl-2"
                  >
                    {dataList.map((data) => (
                      <Checkbox
                        key={data.key}
                        value={data.value}
                        label={data.key}
                      />
                    ))}
                  </Group>
                </Checkbox.Group>
              </>
            )
          ) : (
            <ScrollArea.Autosize
              viewportRef={viewportRef}
              mah={200}
              type="always"
              scrollbars="y"
              className={!customStyle ? 'border border-blur rounded-md' : ''}
            >
              <Box px="xs" py={5} className=" border-2 border-blur">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <Box
                      className=" flex items-center justify-between pr-2"
                      key={index}
                      onClick={() =>
                        handleItemClick(item.key, item.props.value)
                      }
                      onFocus={() => {
                        handleItemClick(item.key, item.props.value)
                      }}
                    >
                      <Text className=" flex items-center">{item}</Text>
                      {selectedKey === item.key && (
                        <IconCheck
                          color="gray"
                          className=" font-bold"
                          size={20}
                        />
                      )}
                    </Box>
                  ))
                ) : (
                  <Text color="dimmed">
                    Please Choose{' '}
                    {placeHolder === 'District' ? 'Province' : 'District'}
                  </Text>
                )}
              </Box>
            </ScrollArea.Autosize>
          )}
        </Collapse>
      </div>
    </>
  )
}
