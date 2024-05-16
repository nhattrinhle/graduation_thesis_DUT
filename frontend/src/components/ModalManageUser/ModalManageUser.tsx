import React, { useEffect, useMemo, useState } from 'react'
import style from './ModalManageUser.module.scss'
import image from '../../assets/images/user.png'
import {
  Box,
  Button,
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import {
  getAllDistricts,
  getAllProvinces,
  getAllWards,
} from '../../redux/reducers/locationReducer'
import { District } from '@/types/district'
import { Province } from '@/types/province'
import { Ward } from '@/types/ward'
import { optionsFilter } from '../../utils/filterLocation'
import { User } from '@/types/user'
import * as yup from 'yup'
import { useForm, yupResolver } from '@mantine/form'
import Swal from 'sweetalert2'
import { updateUserProfileForAdminService } from '../../service/AdminService'
import { Roles } from '../../types/role'

interface Props {
  user: User | null
  setIsUpdated: (value: boolean) => void
  onClose: () => void
  isUpdated: boolean
}
function ModalManageUser({ user, onClose, setIsUpdated, isUpdated }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [provinceCode, setProvinceCode] = useState<string>(
    user?.provinceCode || '',
  )
  const [districtCode, setDistrictCode] = useState<string>(
    user?.districtCode || '',
  )
  const [wardCode, setWardCode] = useState<string>(user?.wardCode || '')
  const provinces: Province[] = useAppSelector(
    (state) => state.location.provincesList,
  )
  const districts: District[] = useAppSelector(
    (state) => state.location.districtsList,
  )
  const wards: Ward[] = useAppSelector((state) => state.location.wardsList)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getAllProvinces())
  }, [])
  useEffect(() => {
    dispatch(getAllDistricts(provinceCode))
  }, [dispatch, provinceCode])
  useEffect(() => {
    dispatch(getAllWards(districtCode))
  }, [dispatch, districtCode])

  const schema = useMemo(() => {
    return yup.object().shape({
      fullName: yup.string().required('Name is required'),
      phone: yup
        .string()
        .matches(/^[0-9]+$/, 'Phone number must contain only digits')
        .length(10, 'The phone number must be 10 digits long.')
        .required('Phone number is required'),
      provinceCode: yup.string().required('City/Province is required'),
      districtCode: yup.string().required('District is required'),
      wardCode: yup.string().required('Ward is required'),
    })
  }, [])

  const form = useForm({
    initialValues: {
      fullName: user?.fullName,
      phone: user?.phone,
      provinceCode: user?.provinceCode,
      districtCode: user?.districtCode,
      wardCode: user?.wardCode,
    },
    validate: yupResolver(schema),
  })

  const handleUpdateProfile = async (values: any) => {
    const updateInfo = {
      ...values,
    }
    if (values.phone === user?.phone) delete updateInfo.phone
    try {
      if (user) {
        setIsLoading(true)
        await updateUserProfileForAdminService(updateInfo, user?.userId)
        onClose()
        setIsUpdated(!isUpdated)
        Swal.fire({
          title: 'Updated successfully',
          icon: 'success',
        })
      }
    } catch (error: any) {
      Swal.fire({
        title: error.response.data.error.message,
        icon: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="">
      <div className="flex flex-row ">
        <div className="bg-[#f8fafb]">
          <div className="py-8">
            {user?.avatar ? (
              <img
                src={user.avatar}
                className=" w-60 mx-3 h-50 object-cover rounded-[20px]"
              />
            ) : (
              <img
                src={image}
                className=" w-60 h-50 object-contain rounded-[20px]"
              />
            )}
          </div>
        </div>
        <div className="m-8">
          <form
            onSubmit={form.onSubmit((values) => handleUpdateProfile(values))}
          >
            <Box pos="relative">
              <LoadingOverlay
                visible={isLoading}
                zIndex={10}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'pink', type: 'bars' }}
              />
              <Stack>
                <h1 className="font-semibold text-3xl text-primary font-archivo">
                  User detail
                </h1>

                <TextInput
                  {...form.getInputProps('fullName')}
                  className="font-semibold w-full shadow-md"
                  classNames={{ input: style.inputTextInput }}
                  label="Full Name"
                  rightSection={<IconPencil></IconPencil>}
                  defaultValue={user?.fullName}
                  onKeyUp={(event) => {
                    form.setFieldValue('fullName', event.currentTarget.value)
                  }}
                />

                <div className="flex justify-between ">
                  <TextInput
                    className="font-semibold shadow-md"
                    classNames={{ input: style.inputTextInput }}
                    label="Email"
                    readOnly
                    defaultValue={user?.email}
                  />
                  <TextInput
                    {...form.getInputProps('phone')}
                    className="font-semibold shadow-md"
                    classNames={{ input: style.inputTextInput }}
                    label="Phone Number"
                    rightSection={<IconPencil></IconPencil>}
                    defaultValue={user?.phone}
                    onKeyUp={(event) => {
                      form.setFieldValue('phone', event.currentTarget.value)
                    }}
                  />
                </div>
                <div className="flex flex-row gap-4">
                  <Select
                    classNames={{ input: style.inputTextInput }}
                    className="shadow-md"
                    label="City/Province"
                    placeholder="City/Province"
                    allowDeselect={false}
                    searchable
                    comboboxProps={{
                      position: 'bottom',
                      offset: 0,
                      transitionProps: { transition: 'pop', duration: 200 },
                    }}
                    data={provinces.flatMap((prov: Province) => [
                      {
                        value: prov.provinceCode,
                        label: prov.nameEn,
                      },
                    ])}
                    filter={optionsFilter}
                    value={provinceCode}
                    onChange={(value: any) => {
                      if (value) {
                        setProvinceCode(value)
                        form.setFieldValue('provinceCode', value)
                        setWardCode('')
                        form.setFieldValue('wardCode', null)
                        setDistrictCode('')
                        form.setFieldValue('districtCode', null)
                      } else {
                        setProvinceCode('')
                      }
                    }}
                  />
                  <Select
                    classNames={{ input: style.inputTextInput }}
                    label="District"
                    className="shadow-md"
                    placeholder="District"
                    allowDeselect={false}
                    searchable
                    comboboxProps={{
                      position: 'bottom',
                      offset: 0,
                      transitionProps: { transition: 'pop', duration: 200 },
                    }}
                    data={districts.flatMap((district: District) => [
                      {
                        value: district.districtCode,
                        label: district.nameEn,
                      },
                    ])}
                    filter={optionsFilter}
                    value={districtCode}
                    onChange={(value: any) => {
                      if (value) {
                        setDistrictCode(value)
                        form.setFieldValue('districtCode', value)
                        setWardCode('')
                        form.setFieldValue('wardCode', null)
                      } else {
                        setDistrictCode('')
                      }
                    }}
                  />
                  <Select
                    classNames={{ input: style.inputTextInput }}
                    label="Ward"
                    className="shadow-md"
                    placeholder="Ward"
                    allowDeselect={false}
                    searchable
                    comboboxProps={{
                      position: 'bottom',
                      offset: 0,
                      transitionProps: { transition: 'pop', duration: 200 },
                    }}
                    data={wards.flatMap((ward: Ward) => [
                      {
                        value: ward.wardCode,
                        label: ward.nameEn,
                      },
                    ])}
                    filter={optionsFilter}
                    value={wardCode}
                    onChange={(value: any) => {
                      if (value) {
                        setWardCode(value)
                        form.setFieldValue('wardCode', value)
                      } else {
                        setWardCode('')
                      }
                    }}
                  />
                </div>
                <TextInput
                  {...form.getInputProps('address')}
                  classNames={{ input: style.inputTextInput }}
                  className="shadow-md"
                  label="Address"
                  placeholder="Address"
                  rightSection={<IconPencil></IconPencil>}
                  defaultValue={user?.address}
                  onKeyUp={(event) => {
                    form.setFieldValue('address', event.currentTarget.value)
                  }}
                />
                {user?.roleId === Roles.Seller ? (
                  <Button
                    type="submit"
                    classNames={{ root: style.rootButtonUpdate }}
                  >
                    Update
                  </Button>
                ) : (
                  ''
                )}
              </Stack>
            </Box>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalManageUser
