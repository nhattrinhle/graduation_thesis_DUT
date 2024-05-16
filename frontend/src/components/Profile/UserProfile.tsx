import React, { useState, useEffect } from 'react'
import {
  Divider,
  Avatar,
  FileButton,
  Button,
  TextInput,
  Select,
  ComboboxItem,
  OptionsFilter,
  Stack,
} from '@mantine/core'
import {
  IconCamera,
  IconPencil,
  IconX,
  IconDeviceFloppy,
  IconSquareRoundedXFilled,
} from '@tabler/icons-react'
import styles from './UserProfile.module.scss'
import { useDisclosure } from '@mantine/hooks'
import {
  getProfile,
  uploadAvatar,
  uploadAvatarToCloudinary,
  updateProfile,
} from '../../service/ProfileService'
import { User } from '../../types/user'
import Swal from 'sweetalert2'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'
import * as yup from 'yup'
import {
  useFetchProvincesQuery,
  useFetchDistrictsQuery,
  useFetchWardsQuery,
} from '../../redux/reducers/locationSlice'
import ChangePassword from '../ChangePassword/ChangePassword'
import { useAppDispatch } from '../../redux/hooks'
import { setUser } from '../../redux/reducers/userSlice'
import { Ward } from '../../types/ward'
import { District } from '../../types/district'
import UnderMaintenance from '../UnderMaintenance/UnderMaintenance'
import { getMaintenanceModeForSeller } from '../../service/MaintenanceService'

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const splittedSearch = search.toLowerCase().trim().split(' ')
  return (options as ComboboxItem[]).filter((option) => {
    const words = option.label.toLowerCase().trim().split(' ')
    return splittedSearch.every((searchWord) =>
      words.some((word) => word.includes(searchWord)),
    )
  })
}

export default function SellerProfile() {
  const [maintenanceMessage, setMaintenanceMessage] = useState('')
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const dispatch = useAppDispatch()

  const [nameEditing, setNameEditing] = useState(false)
  const [phoneEditing, setPhoneEditing] = useState(false)
  const [addressEditing, setAddressEditing] = useState(false)
  const [locationEditing, setLocationEditing] = useState(false)

  const [opened, { open, close }] = useDisclosure(false)

  const [userInfo, setUserInfo] = useState<User>()

  const [loading, setLoading] = useState(false)
  const [saveChangeLoading, setSaveChangeLoading] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)

  const [showSaveProfileBtn, setShowSaveProfileBtn] = useState(false)

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

  const listSchema = yup.object().shape({
    fullName:
      nameEditing && userInfo?.roleId === 2
        ? yup.string().required('Name is required')
        : yup.string().nullable(),
    phone:
      phoneEditing && userInfo?.roleId === 2
        ? yup
            .string()
            .matches(/^[0-9]+$/, 'Phone number must contain only digits')
            .length(10, 'The phone number must be 10 digits long.')
            .required('Phone number is required')
        : yup.string().nullable(),

    provinceCode: locationEditing
      ? yup.string().required('City/Province is required')
      : yup.string().nullable(),
    districtCode: locationEditing
      ? yup.string().required('District is required')
      : yup.string().nullable(),
    wardCode: locationEditing
      ? yup.string().required('Ward is required')
      : yup.string().nullable(),
    address: addressEditing
      ? yup.string().required('Address is required')
      : yup.string().nullable(),
  })

  const form = useForm({
    initialValues: {
      email: userInfo?.email,
      fullName: userInfo?.fullName,
      phone: userInfo?.phone,
      provinceCode: userInfo?.provinceCode,
      districtCode: userInfo?.districtCode,
      wardCode: userInfo?.wardCode,
      address: userInfo?.address,
    },
    validate: yupResolver(listSchema),
  })

  const handleGetMaintenanceMode = async () => {
    try {
      const res = await getMaintenanceModeForSeller()
      setIsUnderMaintenance((_prev) => res.metaData.isMaintenance)
      setMaintenanceMessage(res.metaData.description)
      return res.metaData.isMaintenance
    } catch (error) {
      console.error(error)
    }
  }

  const handleUploadAvatar = async () => {
    const maintenanceStatus = await handleGetMaintenanceMode()
    if (maintenanceStatus) return
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'gjwqdwrx')
      formData.append('api_key', '618339743287128')

      setLoading(true)
      const data = await uploadAvatarToCloudinary(formData)
      await uploadAvatar(data.secure_url)
      setLoading(false)

      setUserInfo(
        (prev) =>
          ({
            ...prev,
            avatar: data.secure_url,
          }) as User,
      )
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Avatar updated successfully!',
        showConfirmButton: false,
        timer: 1000,
      })
    }

    setFile(null)
    setLoading(false)
  }

  const handleClearAvatar = async () => {
    const maintenanceStatus = await handleGetMaintenanceMode()
    if (maintenanceStatus) return
    Swal.fire({
      title: 'Do you want to delete profile image?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#2ac58b',
      denyButtonColor: '#fe6563',
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await uploadAvatar(null)
        setUserInfo(
          (prev) =>
            ({
              ...prev,
              avatar: '',
            }) as User,
        )
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Avatar deleted successfully!',
          showConfirmButton: false,
          timer: 1000,
        })
      }
    })
  }

  const getUserProfile = async () => {
    const data = await getProfile()
    const roleId = data.roleId
    setUserInfo({ ...data, roleId: roleId })
    dispatch(setUser({ ...data, roleId: roleId }))
    setProvinceCode(data.provinceCode)
    setDistrictCode(data.districtCode)
    setWardCode(data.wardCode)
  }

  const handleUpdateProfile = async (values: any) => {
    const maintenanceStatus = await handleGetMaintenanceMode()
    if (maintenanceStatus) return

    const updateInfo = { ...values }
    if (values.phone === userInfo?.phone) delete updateInfo.phone
    try {
      setSaveChangeLoading(true)
      await updateProfile(updateInfo)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Profile updated successfully!',
        showConfirmButton: false,
        timer: 1000,
      })
      setIsUpdated((prev) => !prev)
      setShowSaveProfileBtn(false)
    } catch (err: any) {
      form.setFieldError('phone', err.response.data.error.message)
    } finally {
      setSaveChangeLoading(false)
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [isUpdated])

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
      <div className={styles.container}>
        <div className=" flex justify-between gap-x-1 items-center w-full">
          <h1 className={styles.heading}>My Profile</h1>
          <Button
            className=" mobile:text-[12px] sm:text-[16px]"
            variant="outline"
            onClick={async () => {
              const status = await handleGetMaintenanceMode()
              if (status === false) open()
            }}
          >
            Change Password
          </Button>
        </div>

        <Divider my="md" />
        <div className={styles.outer}>
          <div className={styles.imgOuter}>
            <div className={styles.imgInner}>
              {!file && userInfo?.avatar && userInfo?.avatar.length > 4 && (
                <IconSquareRoundedXFilled
                  className={styles.clearAvatar}
                  onClick={handleClearAvatar}
                ></IconSquareRoundedXFilled>
              )}
              <Avatar
                src={file ? URL.createObjectURL(file) : userInfo?.avatar}
                size={150}
                className={styles.avatar}
              ></Avatar>

              <FileButton onChange={setFile} accept="image/png,image/jpeg">
                {(props) => (
                  <Button
                    {...props}
                    className={styles.uploadBtn}
                    disabled={loading ? true : false}
                  >
                    <IconCamera className="mr-1" />
                    Choose Image
                  </Button>
                )}
              </FileButton>
            </div>

            {file && (
              <div className={styles.saveAndCancel}>
                <Button
                  className=" col-span-6"
                  bg="#adb5bd"
                  onClick={() => setFile(null)}
                  disabled={loading ? true : false}
                >
                  <IconX className="mr-1" />
                  Cancel
                </Button>
                <Button
                  className=" col-span-6 px-2"
                  loading={loading ? true : false}
                  bg="#1b2850"
                  onClick={handleUploadAvatar}
                >
                  <IconDeviceFloppy size={30} className="mr-1" />
                  Save Avatar
                </Button>
              </div>
            )}
          </div>
          <div className={styles.personalInfoOuter}>
            <h1 className={styles.title}>Personal Information</h1>
            <form
              onSubmit={form.onSubmit((values) => handleUpdateProfile(values))}
            >
              <Stack>
                <TextInput
                  {...form.getInputProps('fullName')}
                  defaultValue={userInfo?.fullName}
                  id="name"
                  className="font-semibold"
                  size="md"
                  w="100%"
                  label="Your name"
                  placeholder="Your Name"
                  rightSection={<IconPencil></IconPencil>}
                  onKeyUp={(event) => {
                    setNameEditing(true)
                    setShowSaveProfileBtn(true)
                    form.setFieldValue('fullName', event.currentTarget.value)
                  }}
                />
                <TextInput
                  {...form.getInputProps('email')}
                  id="email"
                  size="md"
                  w="100%"
                  label="Email"
                  placeholder="Email"
                  disabled
                  value={userInfo?.email}
                />

                <TextInput
                  {...form.getInputProps('phone')}
                  defaultValue={userInfo?.phone}
                  id="phone"
                  size="md"
                  w="100%"
                  label="Phone Number"
                  placeholder="Phone Number"
                  rightSection={<IconPencil></IconPencil>}
                  onKeyUp={(event) => {
                    setPhoneEditing(true)
                    setShowSaveProfileBtn(true)
                    form.setFieldValue('phone', event.currentTarget.value)
                  }}
                />

                <div className=" flex gap-x-3 mobile:gap-y-5 xs:flex-row mobile:flex-col ">
                  <Select
                    size="md"
                    className=" flex-grow"
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
                      setLocationEditing(true)
                      setShowSaveProfileBtn(true)
                    }}
                    value={provinceCode}
                  />
                  <Select
                    size="md"
                    className=" flex-grow"
                    allowDeselect={false}
                    withAsterisk
                    classNames={{ label: styles.label }}
                    checkIconPosition="right"
                    label="District"
                    placeholder="District"
                    data={districts?.flatMap((dist: any) => [
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
                      setLocationEditing(true)
                      setShowSaveProfileBtn(true)
                    }}
                    value={districtCode}
                  />
                  <Select
                    size="md"
                    className=" flex-grow"
                    allowDeselect={false}
                    withAsterisk
                    classNames={{ label: styles.label }}
                    checkIconPosition="right"
                    label="Ward"
                    placeholder="Ward"
                    data={wards?.flatMap((ward: any) => [
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
                      setLocationEditing(true)
                      setShowSaveProfileBtn(true)
                    }}
                    value={wardCode}
                  />
                </div>
                <TextInput
                  {...form.getInputProps('address')}
                  defaultValue={userInfo?.address}
                  withAsterisk
                  classNames={{ label: styles.label }}
                  id="address"
                  size="md"
                  w="100%"
                  label="Address"
                  placeholder="Address"
                  rightSection={<IconPencil></IconPencil>}
                  onKeyUp={(event) => {
                    setAddressEditing(true)
                    setShowSaveProfileBtn(true)
                    form.setFieldValue('address', event.currentTarget.value)
                  }}
                />

                <div className={styles.btnContainer}>
                  <Button
                    loading={saveChangeLoading}
                    size="md"
                    type="submit"
                    className={
                      showSaveProfileBtn ? styles.btn : styles.disableBtn
                    }
                    disabled={showSaveProfileBtn ? false : true}
                  >
                    Save Changes
                  </Button>
                </div>
              </Stack>
            </form>
          </div>
        </div>

        <ChangePassword isOpened={opened} onClose={close} />
        <UnderMaintenance
          setStatus={setIsUnderMaintenance}
          status={isUnderMaintenance}
          maintenanceMessage={maintenanceMessage}
        />
      </div>
    </>
  )
}
