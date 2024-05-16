import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  FileButton,
  Button,
  Group,
  Select,
  NumberInput,
  TextInput,
  Radio,
} from '@mantine/core'
import style from './ModalProperty.module.scss'
import { Category, Feature, Properties } from '@/types'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { Province } from '@/types/province'
import {
  getAllProvinces,
  getAllDistricts,
  getAllWards,
} from '../../redux/reducers/locationReducer'
import { optionsFilter } from '../../utils/filterLocation'
import { District } from '@/types/district'
import { Ward } from '@/types/ward'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { getProfile } from '../../service/ProfileService'
import { User } from '../../types/user'
import { PackageService } from '@/types/packageService'
import { getAllRentalPackageService } from '../../service/PackageService'
import {
  AddNewPropertyForSeller,
  updatePropertyForSeller,
} from '../../service/SellerService'
import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { IconColorPicker } from '@tabler/icons-react'
import { TiDelete } from 'react-icons/ti'
import {
  ADD_PROP,
  EDIT_PROP,
  VIEW_PROP,
} from '../../constants/actions.constant'
import { AVAILABLE } from '../../constants/statusProperty.constant'
interface Props {
  property: Properties | null
  onClose: () => void
  isUpdated?: (value: boolean) => void
  setShouldUpdate?: React.Dispatch<React.SetStateAction<boolean>>
  action?: string
  setHasChangedForm?: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalProperty = ({
  property,
  onClose,
  setShouldUpdate,
  action,
  setHasChangedForm,
}: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      TextStyle,
      Color,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    onUpdate({ editor }) {
      form.setFieldValue('description', editor.getHTML())
    },
    content: property?.description,
  })
  const [files, setFiles] = useState<File[]>([])
  const resetRef = useRef<() => void>(null)

  const [loading, setLoading] = useState(false)

  const [provinceCode, setProvinceCode] = useState<string | undefined>(
    property?.location.provinceCode,
  )
  const [districtCode, setDistrictCode] = useState<string | undefined>(
    property?.location.districtCode,
  )
  const [wardCode, setWardCode] = useState<string | undefined>(
    property?.location.wardCode,
  )
  const [feature, setFeature] = useState<string | undefined>(
    String(property?.feature.featureId),
  )
  const [category, setCategory] = useState<string | undefined>(
    String(property?.category.categoryId),
  )
  const dispatch = useAppDispatch()

  const provinces: Province[] = useAppSelector(
    (state) => state.location.provincesList,
  )
  useEffect(() => {
    dispatch(getAllProvinces())
  }, [dispatch])

  const districts: District[] = useAppSelector(
    (state) => state.location.districtsList,
  )
  useEffect(() => {
    dispatch(getAllDistricts(provinceCode))
  }, [dispatch, provinceCode])

  const wards: Ward[] = useAppSelector((state) => state.location.wardsList)
  useEffect(() => {
    dispatch(getAllWards(districtCode))
  }, [dispatch, districtCode])

  const categories: Category[] = useAppSelector(
    (state) => state.category.categoriesList,
  )

  const features: Feature[] = useAppSelector(
    (state) => state.feature.featuresList,
  )
  useEffect(() => {
    setDistrictCode('')
    setWardCode('')
  }, [provinceCode])

  useEffect(() => {
    setWardCode('')
  }, [districtCode])

  const clearFile = () => {
    setFiles([])
    resetRef.current?.()
  }
  // Get userProfile to get current credit.
  const [userProfile, setUserProfile] = useState<User | undefined>()
  const getUserProfile = async () => {
    const res = await getProfile()
    setUserProfile(res)
  }
  useEffect(() => {
    getUserProfile()
  }, [])

  const modalSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required('Name is required'),
      featureId: yup.string().required('Featured is required'),
      categoryId: yup.string().required('Category is required'),
      provinceCode: yup.string().required('Province Code is required'),
      districtCode: yup.string().required('District Code is required'),
      wardCode: yup.string().required('Ward Code is required'),
      street: yup.string().required('Street is required'),
      address: yup.string().required('Address is required'),
      price: yup.number().positive().required('Price is required'),
      landArea: yup.string().nullable(),
      areaOfUse: yup.string().nullable(),
      numberOfBedRoom: yup
        .number()
        .positive()
        .required('Number of bedrooms is required'),
      numberOfToilet: yup
        .number()
        .positive()
        .required('Number of toilets is required'),
      numberOfFloor: yup
        .number()
        .positive()
        .required('Number of floors is required'),
      direction: yup.string().nullable(),
      description: yup.string().nullable(),
    })
  }, [])

  const form = useForm({
    initialValues: {
      name: property?.name,
      featureId: feature,
      categoryId: category,
      provinceCode: provinceCode,
      districtCode: districtCode,
      wardCode: wardCode,
      street: property?.location.street,
      address: property?.location.address,
      price: property?.price,
      landArea: property?.landArea,
      areaOfUse: property?.areaOfUse,
      numberOfBedRoom: property?.numberOfBedRoom,
      numberOfToilet: property?.numberOfToilet,
      numberOfFloor: property?.numberOfFloor,
      direction: property?.direction,
      description: property?.description,
    },
    validate: yupResolver(modalSchema),
  })

  const handleUploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ntdit_dev_image')
    formData.append('api_key', '166589584369138')
    setLoading(true)
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dzip9qwyz/image/upload',
      formData,
      {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      },
    )
    const data = response.data
    const imageUrl = data.secure_url // get image url.
    return imageUrl
  }

  const handleRemoveImage = (file: File) => {
    setFiles(files.filter((f) => f !== file))
  }
  const handleAddMoreImage = (inputFiles: File[]) => {
    if (files.length > 0) {
      setFiles([...files, ...inputFiles])
    } else {
      setFiles(inputFiles)
    }
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer
      toast.onmouseleave = Swal.resumeTimer
    },
  })
  const handleAddNew = async (value: any) => {
    const convertProperty = {
      ...value,
      featureId: Number(feature),
      categoryId: Number(category),
      numberOfBedRoom: Number(value.numberOfBedRoom),
      numberOfToilet: Number(value.numberOfToilet),
      numberOfFloor: Number(value.numberOfFloor),
      price: Number(value.price),
      currencyCode: 'USD',
    }

    const option = {
      serviceId: packageServiceSelected,
    }
    try {
      loading
      if (userProfile?.balance && userProfile.balance >= 20) {
        if (files.length >= 5) {
          // Call function handleUpload to push images to the cloudinary.
          const arr = []
          for (let i = 0; i < files.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            const res = await handleUploadImage(files[i])
            arr.push(res)
          }
          // After all of images is pushed. Send it to server.
          const newProperty = { ...convertProperty, images: arr }
          const res = await AddNewPropertyForSeller(newProperty, option)
          setLoading(false)
          onClose()
          Swal.fire({
            title: 'Added successfully',
            icon: 'success',
          })
          setShouldUpdate!((prev) => !prev)
          return res
        } else {
          Swal.fire({
            title: 'Please upload at least 5 images',
            icon: 'error',
          })
        }
      } else {
        setLoading(false)
        Swal.fire({
          title:
            'Your balance is not enough to create new property. Please refill your balance!',
          icon: 'warning',
        })
      }
    } catch (error: any) {
      setLoading(false)
      Toast.fire({
        text: error.response.data.error.message,
        icon: 'error',
      })
    }
  }

  const handleUpdate = async (value: any) => {
    delete value.featureId
    delete value.categoryId
    delete value.provinceCode
    delete value.districtCode
    delete value.wardCode
    delete value.street
    delete value.address
    delete value.numberOfBedRoom
    delete value.numberOfToilet
    delete value.numberOfFloor
    if (property?.propertyId) {
      try {
        setLoading(true)
        await updatePropertyForSeller(property?.propertyId, value)
        setLoading(false)
        onClose()
        Swal.fire({
          title: 'Updated successfully',
          icon: 'success',
        })
        setShouldUpdate!((prev) => !prev)
      } catch (error: any) {
        Toast.fire({
          text: error.response.data.error.message,
          icon: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = (value: any) => {
    if (property === null) {
      handleAddNew(value)
    } else {
      handleUpdate(value)
    }
  }

  const [packageServiceSelected, setPackageServiceSelected] = useState('')
  const [packageService, setPackageService] = useState<PackageService[]>([])
  const getAllPackageService = async () => {
    const res = await getAllRentalPackageService()
    setPackageService(res.data.metaData)
  }
  useEffect(() => {
    getAllPackageService()
  }, [])

  const handleOnChangeForm = () => {
    setHasChangedForm!(true)
  }
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values)
      })}
      onChange={() => handleOnChangeForm()}
    >
      <div>
        <div className={style.rowModal}>
          <TextInput
            {...form.getInputProps('name')}
            className={style.colModal}
            id="name"
            label="Property name"
            placeholder="Enter name "
            withAsterisk
            onKeyUp={(event) => {
              form.setFieldValue('name', event.currentTarget.value)
            }}
            readOnly={
              action === VIEW_PROP
                ? true
                : action === EDIT_PROP
                  ? false
                  : action === ADD_PROP
                    ? false
                    : true
            }
            classNames={{
              input: action === VIEW_PROP ? 'bg-slate-200' : 'bg-white',
            }}
          />
          {/* this comment can be use in future if this project will expand. 
          <TextInput
            {...form.getInputProps('code')}
            className={style.colModal}
            label="Property code"
            placeholder="Enter code "
            withAsterisk
            onKeyUp={(event) => {
              form.setFieldValue('code', event.currentTarget.value)
            }}
          /> */}
          <TextInput
            {...form.getInputProps('direction')}
            className={style.colModal}
            label="Direction"
            placeholder="Enter direction"
            onKeyUp={(event) => {
              form.setFieldValue('direction', event.currentTarget.value)
            }}
            readOnly={
              action === VIEW_PROP
                ? true
                : action === EDIT_PROP
                  ? false
                  : action === ADD_PROP
                    ? false
                    : true
            }
            classNames={{
              input: action === VIEW_PROP ? 'bg-slate-200' : 'bg-white',
            }}
          />
          <Select
            {...form.getInputProps('featureId')}
            className={style.colModal}
            label="Featured"
            placeholder="Choose featured "
            withAsterisk
            data={features.flatMap((feature) => [
              {
                value: feature.featureId.toString(),
                label: feature.name,
              },
            ])}
            value={feature}
            onChange={(_value: any) => {
              setFeature(_value)
            }}
            readOnly={property === null ? false : true}
            classNames={{
              input: property === null ? 'bg-white' : 'bg-slate-200',
            }}
          />
          <Select
            {...form.getInputProps('categoryId')}
            className={style.colModal}
            label="Category"
            placeholder="Choose featured "
            withAsterisk
            data={categories.flatMap((category) => [
              {
                value: category.categoryId.toString(),
                label: category.name,
              },
            ])}
            value={category}
            onChange={(_value: any) => {
              setCategory(_value)
            }}
            readOnly={property === null ? false : true}
            classNames={{
              input: property === null ? 'bg-white' : 'bg-slate-200',
            }}
          />
        </div>
        <div className={`${style.rowModal} ${style.mt}`}>
          <Select
            className={style.colModal}
            label="City/Province"
            placeholder="Choose city/province"
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
            }}
            {...form.getInputProps('provinceCode')}
            onChange={(_value: any) => {
              form.setFieldValue('provinceCode', _value)
              setProvinceCode(_value)
              setDistrictCode('')
              setWardCode('')
            }}
            value={provinceCode}
            readOnly={property === null ? false : true}
            classNames={{
              input: property === null ? 'bg-white' : 'bg-slate-200',
            }}
          />
          <Select
            {...form.getInputProps('districtCode')}
            className={style.colModal}
            label="District"
            placeholder="Choose district "
            withAsterisk
            searchable
            allowDeselect
            data={districts.flatMap((district: District) => [
              {
                value: district.districtCode,
                label: district.nameEn,
              },
            ])}
            filter={optionsFilter}
            comboboxProps={{
              position: 'bottom',
              offset: 0,
              transitionProps: { transition: 'pop', duration: 200 },
            }}
            onChange={(_value: any) => {
              form.setFieldValue('districtCode', _value)
              setDistrictCode(_value)
              setWardCode('')
            }}
            value={districtCode}
            readOnly={property === null ? false : true}
            classNames={{
              input: property === null ? 'bg-white' : 'bg-slate-200',
            }}
          />
          <Select
            {...form.getInputProps('wardCode')}
            className={style.colModal}
            label="Ward"
            placeholder="Choose ward "
            withAsterisk
            searchable
            allowDeselect
            data={wards.flatMap((ward: Ward) => [
              {
                value: ward.wardCode,
                label: ward.nameEn,
              },
            ])}
            filter={optionsFilter}
            comboboxProps={{
              position: 'bottom',
              offset: 0,
              transitionProps: { transition: 'pop', duration: 200 },
            }}
            onChange={(_value: any) => {
              form.setFieldValue('wardCode', _value)
              setWardCode(_value)
            }}
            value={wardCode}
            readOnly={property === null ? false : true}
            classNames={{
              input: property === null ? 'bg-white' : 'bg-slate-200',
            }}
          />
          <TextInput
            {...form.getInputProps('street')}
            className={style.colModal}
            label="Street"
            required
            placeholder="Enter street"
            readOnly={property === null ? false : true}
            classNames={{
              input: property === null ? 'bg-white' : 'bg-slate-200',
            }}
          />
        </div>
        <div className={`${style.rowModal} ${style.mt}`}>
          <TextInput
            {...form.getInputProps('address')}
            className={style.colModal}
            label="Address"
            required
            placeholder="Enter address"
            readOnly={property === null ? false : true}
            classNames={{
              input: property === null ? 'bg-white' : 'bg-slate-200',
            }}
          />
          <NumberInput
            {...form.getInputProps('numberOfFloor')}
            className={style.colModal}
            required
            label="Number of floor"
            placeholder="Enter number of floor"
            allowDecimal={false}
            min={0}
            hideControls
            readOnly={property === null ? false : true}
            classNames={{
              input: property === null ? 'bg-white' : 'bg-slate-200',
            }}
          />
          <NumberInput
            {...form.getInputProps('numberOfBedRoom')}
            className={style.colModal}
            required
            label="Number of bedroom"
            placeholder="Enter number of bedroom"
            allowDecimal={false}
            min={0}
            hideControls
            readOnly={property === null ? false : true}
            classNames={{
              input: property === null ? 'bg-white' : 'bg-slate-200',
            }}
          />
          <NumberInput
            {...form.getInputProps('numberOfToilet')}
            className={style.colModal}
            required
            label="Number of toilet"
            placeholder="Enter number of toilet"
            allowDecimal={false}
            min={0}
            hideControls
            readOnly={property === null ? false : true}
            classNames={{
              input: property === null ? 'bg-white' : 'bg-slate-200',
            }}
          />
        </div>
        <div className={`${style.rowModal} ${style.mt}`}>
          <NumberInput
            {...form.getInputProps('landArea')}
            className={style.colModal}
            label="Land of Area"
            placeholder="Enter number"
            hideControls
            min={0}
            readOnly={
              action === VIEW_PROP
                ? true
                : action === EDIT_PROP
                  ? false
                  : action === ADD_PROP
                    ? false
                    : true
            }
            classNames={{
              input: action === VIEW_PROP ? 'bg-slate-200' : 'bg-white',
            }}
          />
          <NumberInput
            {...form.getInputProps('areaOfUse')}
            className={style.colModal}
            label="Area of use"
            placeholder="Enter number "
            hideControls
            min={0}
            readOnly={
              action === VIEW_PROP
                ? true
                : action === EDIT_PROP
                  ? false
                  : action === ADD_PROP
                    ? false
                    : true
            }
            classNames={{
              input: action === VIEW_PROP ? 'bg-slate-200' : 'bg-white',
            }}
          />
          <NumberInput
            {...form.getInputProps('price')}
            className={style.colModal}
            label="Price"
            placeholder="Enter price "
            min={0}
            hideControls
            required
            readOnly={
              action === VIEW_PROP
                ? true
                : action === EDIT_PROP
                  ? false
                  : action === ADD_PROP
                    ? false
                    : true
            }
            classNames={{
              input: action === VIEW_PROP ? 'bg-slate-200' : 'bg-white',
            }}
          />
          <TextInput
            className={style.colModal}
            label="Currency Code"
            placeholder="Enter currency"
            readOnly
            classNames={{
              input: 'bg-slate-200',
            }}
            defaultValue="USD"
          />
        </div>
        {!property && (
          <div className={style.mt}>
            <Radio.Group
              value={packageServiceSelected}
              onChange={(value) => setPackageServiceSelected(value)}
              withAsterisk
              label="How long do you want to public this property?"
              className="text-base"
              classNames={{
                root: style.radioGroupRoot,
                label: style.radioGroupLabel,
              }}
            >
              <Group classNames={{ root: style.groupRoot }}>
                {packageService.length > 0 &&
                  packageService.map((item) => (
                    <div
                      key={item.serviceId}
                      className="flex gap-1 items-center text-[14px]"
                    >
                      <Radio
                        key={item.serviceId}
                        value={String(item.serviceId)}
                        label={`${item.duration} days`}
                      />{' '}
                      - {Number(item.price)} credits
                    </div>
                  ))}
              </Group>
            </Radio.Group>
          </div>
        )}

        {/* This comment is used for future if there is any error.
        <Textarea
          {...form.getInputProps('description')}
          className={style.description}
          label="Description"
          placeholder="Enter decription"
          autosize
          minRows={5}
          onKeyUp={(event) => {
            form.setFieldValue('description', event.currentTarget.value)
          }}
        /> */}
        <div>
          <div className="font-semibold text-[14px] mt-4 mb-2">
            Description{' '}
          </div>
          <RichTextEditor
            editor={editor}
            {...form.getInputProps('description')}
          >
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ColorPicker
                colors={[
                  '#25262b',
                  '#868e96',
                  '#fa5252',
                  '#e64980',
                  '#be4bdb',
                  '#7950f2',
                  '#4c6ef5',
                  '#228be6',
                  '#15aabf',
                  '#12b886',
                  '#40c057',
                  '#82c91e',
                  '#fab005',
                  '#fd7e14',
                ]}
              />
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Control interactive={false}>
                  <IconColorPicker size="1rem" stroke={1.5} />
                </RichTextEditor.Control>
                <RichTextEditor.Color color="#F03E3E" />
                <RichTextEditor.Color color="#7048E8" />
                <RichTextEditor.Color color="#1098AD" />
                <RichTextEditor.Color color="#37B24D" />
                <RichTextEditor.Color color="#F59F00" />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.UnsetColor />

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
        </div>

        <div className="mt-[20px]">
          {property === null && (
            <Group justify="start">
              <FileButton
                resetRef={resetRef}
                onChange={(file: File[]) => {
                  handleAddMoreImage(file)
                }}
                accept="image/png,image/jpeg"
                multiple
              >
                {(props) => (
                  <Button
                    type="button"
                    {...props}
                    classNames={{ root: style.rootButton }}
                  >
                    Choose images
                  </Button>
                )}
              </FileButton>
              <Button
                disabled={files.length > 0 ? false : true}
                className={
                  files.length > 0 ? style.resetBtnAfter : style.resetBtn
                }
                onClick={clearFile}
              >
                Reset
              </Button>
            </Group>
          )}

          {files.length > 0 && (
            <div className="border flex flex-row border-grey mt-[12px] bg-white min-h-25 w-full">
              <div className=" px-4 py-2 overflow-hidden flex flex-wrap gap-4 relative">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      key={index}
                      alt="uploaded image"
                      className="object-contain shadow-xl h-40 w-36"
                      src={URL.createObjectURL(file)}
                    />
                    <TiDelete
                      size={24}
                      className="bg-slate-200 rounded-md absolute top-0 right-0 cursor-pointer "
                      color="grey"
                      onClick={() => handleRemoveImage(file)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {property !== null && (
            <div className="border flex flex-row border-grey mt-[12px] bg-white min-h-25 w-full">
              <div className=" px-4 py-2 overflow-hidden flex flex-wrap gap-4">
                {property?.images.map((image, index) => (
                  <img
                    key={index}
                    alt="uploaded image"
                    className="object-contain shadow-xl h-40 w-36"
                    src={image.imageUrl}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="text-base text-primary font-semibold mt-4 ">
          NOTE: You cannot change some information of your new property, so
          please make sure you use the right information!
        </div>
        <div className={style.coverBtn}>
          {action === ADD_PROP ? (
            <Button
              type="submit"
              classNames={{ root: style.rootButton }}
              loading={loading ? true : false}
            >
              Add New
            </Button>
          ) : action === EDIT_PROP && property?.status === AVAILABLE ? (
            <Button
              type="submit"
              classNames={{ root: style.rootButton }}
              loading={loading ? true : false}
            >
              Update
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
    </form>
  )
}

export default ModalProperty
