import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Stack, Modal, TextInput, Select } from '@mantine/core'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'
import * as yup from 'yup'
import styles from './UpgradeSeller.module.scss'
import { IconPhone, IconUser } from '@tabler/icons-react'
import { optionsFilter } from '../../utils/filterLocation'
import {
  useFetchDistrictsQuery,
  useFetchProvincesQuery,
  useFetchWardsQuery,
} from '../../redux/reducers/locationSlice'
import { District } from '../../types/district'
import { Ward } from '../../types/ward'
import { upgradeToSeller } from '../../service/UserService'
import { signOutSuccess } from '../../redux/reducers/sessionSlice'
import { resetUser } from '../../redux/reducers/userSlice'
import { persistor } from '../../redux/store'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface UpgradeSellerProps {
  isOpened: boolean
  onClose: Dispatch<SetStateAction<boolean>>
}
interface FormValues {
  fullName: string
  phone: string
  provinceCode: string
  districtCode: string
  wardCode: string
  address: string
}

export default function UpgradeSeller({
  isOpened,
  onClose,
}: UpgradeSellerProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { data: provinces = [] } = useFetchProvincesQuery()
  const [provinceCode, setProvinceCode] = useState('')

  const { data: fetchedDistricts = [] } = useFetchDistrictsQuery(provinceCode, {
    skip: !provinceCode,
  })
  const [districts, setDistricts] = useState<District[]>(fetchedDistricts ?? [])
  const [districtCode, setDistrictCode] = useState<string | null>('')

  const { data: fetchedWards = [] } = useFetchWardsQuery(districtCode, {
    skip: !districtCode,
  })
  const [wards, setWards] = useState<Ward[]>(fetchedWards ?? [])
  const [wardCode, setWardCode] = useState<string | null>('')

  const listSchema = yup.object().shape({
    fullName: yup.string().required('Name is required'),

    phone: yup
      .string()
      .matches(/^[0-9]+$/, 'Phone number must contain only digits')
      .length(10, 'The phone number must be 10 digits long.')
      .required('Phone number is required'),

    provinceCode: yup.string().required('City/Province is required'),
    districtCode: yup.string().required('District is required'),
    wardCode: yup.string().required('Ward is required'),
    street: yup.string().required('Street is required'),
    address: yup.string().nullable(),
  })

  const form = useForm({
    initialValues: {
      fullName: '',
      phone: '',
      provinceCode: '',
      districtCode: '',
      wardCode: '',
      street: '',
      address: '',
    },
    validate: yupResolver(listSchema),
  })
  const handleLogout = async (message: string) => {
    persistor
      .purge()
      .then(() => persistor.flush())
      .then(() => {
        dispatch(signOutSuccess())
        dispatch(resetUser())
      })

    navigate('/login', { state: { message } })
  }

  const handleUpgradeToSeller = async (values: FormValues) => {
    form.clearErrors()
    setLoading(true)
    const res = await upgradeToSeller(values)
    handleLogout(res.message)
    setLoading(false)
  }

  useEffect(() => {
    if (JSON.stringify(districts) !== JSON.stringify(fetchedDistricts)) {
      setDistricts((_prev) => fetchedDistricts)
    }
  }, [fetchedDistricts])

  useEffect(() => {
    if (JSON.stringify(wards) !== JSON.stringify(fetchedWards)) {
      setWards((_prev) => fetchedWards)
    }
  }, [fetchedWards])

  useEffect(() => {
    setWards((_prev) => [])
  }, [provinceCode])

  return (
    <>
      <Modal
        opened={isOpened}
        onClose={() => {
          form.reset()
          setProvinceCode('')
          setDistrictCode('')
          setWardCode('')
          onClose(false)
        }}
        centered
        title="Upgrade To Seller"
        classNames={{ title: styles.pwTitle }}
        size={'lg'}
      >
        <form
          onSubmit={form.onSubmit((values: any) =>
            handleUpgradeToSeller(values),
          )}
        >
          <Stack className=" px-2">
            <div>
              <h4 className=" m-0 text-primary italic">
                Only sellers can use the listing function.
              </h4>
              <h4 className=" m-0 text-primary">
                Please fill in your information to upgrade to seller if you are
                interested.
              </h4>
            </div>
            <>
              <TextInput
                size="md"
                withAsterisk
                defaultValue=""
                radius="md"
                placeholder="Full Name"
                leftSection={<IconUser size={16} color="green" />}
                label="Full Name"
                {...form.getInputProps('fullName')}
              ></TextInput>
              <TextInput
                size="md"
                withAsterisk
                radius="md"
                leftSection={<IconPhone size={16} color="green" />}
                label="Phone"
                placeholder="Enter your phone number"
                {...form.getInputProps('phone')}
              />
              <div className="grid grid-cols-2 gap-x-2 gap-y-4 ">
                <Select
                  size="md"
                  allowDeselect={false}
                  withAsterisk
                  checkIconPosition="right"
                  label="City/Province"
                  placeholder="City/Province"
                  data={provinces.flatMap((prov: any) => [
                    {
                      value: prov.provinceCode,
                      label: prov.nameEn,
                    },
                  ])}
                  filter={optionsFilter}
                  searchable
                  comboboxProps={{
                    position: 'bottom',
                    offset: 0,
                    transitionProps: { transition: 'pop', duration: 200 },
                  }}
                  {...form.getInputProps('provinceCode')}
                  onChange={(_value: any) => {
                    form.setFieldValue('provinceCode', _value)
                    setProvinceCode((_prev) => _value)
                    form.setFieldValue('districtCode', '')
                    setDistrictCode((_prev) => null)
                    form.setFieldValue('wardCode', '')
                    setWardCode((_prev) => null)
                  }}
                  value={provinceCode}
                />
                <Select
                  size="md"
                  allowDeselect={false}
                  withAsterisk
                  checkIconPosition="right"
                  label="District"
                  placeholder="District"
                  data={districts.flatMap((dist: any) => [
                    {
                      value: dist.districtCode,
                      label: dist.nameEn,
                    },
                  ])}
                  filter={optionsFilter}
                  searchable
                  comboboxProps={{
                    position: 'bottom',
                    offset: 0,
                    transitionProps: { transition: 'pop', duration: 200 },
                  }}
                  {...form.getInputProps('districtCode')}
                  onChange={(_value: any) => {
                    form.setFieldValue('districtCode', _value)
                    setDistrictCode((_prev) => _value)
                    form.setFieldValue('wardCode', '')
                    setWardCode((_prev) => null)
                  }}
                  value={districtCode}
                />
                <Select
                  size="md"
                  allowDeselect={false}
                  withAsterisk
                  classNames={{ label: styles.label }}
                  checkIconPosition="right"
                  label="Ward"
                  placeholder="Ward"
                  data={wards.flatMap((ward: any) => [
                    {
                      value: ward.wardCode,
                      label: ward.nameEn,
                    },
                  ])}
                  filter={optionsFilter}
                  searchable
                  comboboxProps={{
                    position: 'bottom',
                    offset: 0,
                    transitionProps: { transition: 'pop', duration: 200 },
                  }}
                  {...form.getInputProps('wardCode')}
                  onChange={(_value: any) => {
                    form.setFieldValue('wardCode', _value)
                    setWardCode((_prev) => _value)
                  }}
                  value={wardCode}
                />

                <TextInput
                  withAsterisk
                  size="md"
                  classNames={{ label: styles.label }}
                  label="Street"
                  placeholder="Street"
                  defaultValue=""
                  {...form.getInputProps('street')}
                />
              </div>
              <TextInput
                size="md"
                classNames={{ label: styles.label }}
                label="Address"
                placeholder="727/9A, Bach Dang, Danang"
                defaultValue=""
                {...form.getInputProps('address')}
              />
            </>
            <div>
              <div className=" flex justify-center">
                <Button
                  size="md"
                  type="submit"
                  className={styles.btn}
                  loading={loading}
                >
                  Upgrade
                </Button>
              </div>
            </div>
          </Stack>
        </form>
      </Modal>
    </>
  )
}
