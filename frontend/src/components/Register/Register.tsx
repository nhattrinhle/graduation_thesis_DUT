import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Stack,
  PasswordInput,
  Anchor,
  Text,
  Divider,
  Select,
  OptionsFilter,
  ComboboxItem,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'
import * as yup from 'yup'
import { IconUser, IconMail, IconPhone } from '@tabler/icons-react'
import styles from './Register.module.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GoogleButton } from '../Login/GoogleButton'
import {
  useFetchProvincesQuery,
  useFetchDistrictsQuery,
  useFetchWardsQuery,
} from '../../redux/reducers/locationSlice'
import { register } from '../../service/RegisterService'
import { Ward } from '../../types/ward'
import { District } from '../../types/district'
import { validateEmail } from '../../utils/validate'

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const splittedSearch = search.toLowerCase().trim().split(' ')
  return (options as ComboboxItem[]).filter((option) => {
    const words = option.label.toLowerCase().trim().split(' ')
    return splittedSearch.every((searchWord) =>
      words.some((word) => word.includes(searchWord)),
    )
  })
}

export default function Register() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const { data: provinces = [] } = useFetchProvincesQuery()
  const [provinceCode, setProvinceCode] = useState('')

  const { data: fetchedDistricts = [] } = useFetchDistrictsQuery(provinceCode, {
    skip: !provinceCode,
  })
  const [districts, setDistricts] = useState<District[]>([])
  const [districtCode, setDistrictCode] = useState<string | null>('')

  const { data: fetchedWards = [] } = useFetchWardsQuery(districtCode, {
    skip: !districtCode,
  })
  const [wards, setWards] = useState<Ward[]>([])
  const [wardCode, setWardCode] = useState<string | null>('')

  const [sellerAccount, setSellerAccount] = useState(
    location && location.state ? location.state : false,
  )
  const navigate = useNavigate()

  const listSchema = yup.object().shape({
    email: yup
      .string()
      .matches(
        validateEmail,
        'Must match the following pattern: abc123@gmail.com',
      )
      .required('Email is required'),
    fullName: sellerAccount
      ? yup.string().required('Name is required')
      : yup.string().nullable(),
    phone: sellerAccount
      ? yup
          .string()
          .matches(/^[0-9]+$/, 'Phone number must contain only digits')
          .length(10, 'The phone number must be 10 digits long.')
          .required('Phone number is required')
      : yup.string().nullable(),
    password: yup
      .string()
      .matches(
        /^(?=.*[0-9])(?!=.*[a-z])(?!=.*[A-Z])(?!=.*[@\W])(?!.* @).{8,16}$/,
        'Password must contain at least 1 number and 1 character',
      )
      .min(8, 'Password must be at least 8 characters long')
      .max(16, 'Password must be at most 16 characters long')
      .required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Password must match')
      .required('Password Confirmation is required!'),

    provinceCode: sellerAccount
      ? yup.string().required('City/Province is required')
      : yup.string().nullable(),
    districtCode: sellerAccount
      ? yup.string().required('District is required')
      : yup.string().nullable(),
    wardCode: sellerAccount
      ? yup.string().required('Ward is required')
      : yup.string().nullable(),
    address: sellerAccount
      ? yup.string().required('Address is required')
      : yup.string().nullable(),
  })

  const form = useForm({
    initialValues: {
      email: '',
      fullName: null,
      phone: null,
      password: '',
      confirmPassword: '',
      provinceCode: null,
      districtCode: null,
      wardCode: null,
      address: null,
    },
    validate: yupResolver(listSchema),
  })

  const handleRegister = async (values: any) => {
    try {
      setIsLoading(true)
      const res = await register(
        { ...values, street: values.address },
        sellerAccount,
      )
      Swal.fire({
        title: 'Register Successfully!',
        text: res.message,
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 5000,
      })
      navigate('/login')
    } catch (err: any) {
      const errMess = err.response.data.error.message
      if (errMess.includes('email')) {
        form.setErrors({ email: err.response.data.error.message })
      }
      if (errMess.includes('password')) {
        form.setErrors({ password: err.response.data.error.message })
      }
    } finally {
      setIsLoading(false)
    }
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
      <Text className="text-center" size="lg" fw={500}>
        Welcome to{' '}
        <Link to="/home">
          <span className="font-[700] text-archivo text-[#399f83]">
            Modern House
          </span>
        </Link>
        . Register with
      </Text>

      <form onSubmit={form.onSubmit((values) => handleRegister(values))}>
        <Stack>
          <TextInput
            required
            radius="md"
            leftSection={<IconMail size={16} color="green" />}
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
            withAsterisk
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            radius="md"
            {...form.getInputProps('password')}
            withAsterisk
          />
          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Your password"
            radius="md"
            {...form.getInputProps('confirmPassword')}
          />
          {sellerAccount && (
            <>
              <TextInput
                withAsterisk={sellerAccount ? true : false}
                defaultValue=""
                radius="md"
                placeholder="Full Name"
                leftSection={<IconUser size={16} color="green" />}
                label="Full Name"
                {...form.getInputProps('fullName')}
              ></TextInput>
              <TextInput
                withAsterisk={sellerAccount ? true : false}
                radius="md"
                leftSection={<IconPhone size={16} color="green" />}
                label="Phone"
                placeholder="Phone Number"
                {...form.getInputProps('phone')}
              />
            </>
          )}
          {sellerAccount && (
            <div className="grid grid-cols-2 gap-x-2 gap-y-4 ">
              <Select
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
                  setProvinceCode(_value)
                  form.setFieldValue('districtCode', null)
                  setDistrictCode(null)
                  form.setFieldValue('wardCode', null)
                  setWardCode(null)
                }}
                value={provinceCode}
              />
              <Select
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
                  setDistrictCode(_value)
                  form.setFieldValue('wardCode', null)
                  setWardCode(null)
                }}
                value={districtCode}
              />
              <Select
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
                  setWardCode(_value)
                }}
                value={wardCode}
              />
              <TextInput
                withAsterisk
                classNames={{ label: styles.label }}
                label="Address"
                placeholder="Address"
                defaultValue=""
                {...form.getInputProps('address')}
              />
            </div>
          )}

          <Checkbox
            checked={sellerAccount}
            mt="md"
            label="Seller Account"
            onClick={() => {
              form.setValues({
                provinceCode: null,
                districtCode: null,
                wardCode: null,
                address: null,
              })
              setSellerAccount((prev: boolean) => !prev)
            }}
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor>
            <Link to="/login">Already have an account? Login</Link>
          </Anchor>

          <Button
            loading={isLoading}
            size="md"
            type="submit"
            radius="xl"
            classNames={{ root: styles.btnRegister }}
          >
            Register
          </Button>
        </Group>
      </form>
      <Divider
        label="Or continue with "
        labelPosition="center"
        my="lg"
        classNames={{ label: styles.divider }}
      />
      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
      </Group>
    </>
  )
}
