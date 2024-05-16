import { Radio, Group, Button } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import style from './ModalPackageService.module.scss'
import { getAllRentalPackageService } from '../../service/PackageService'
import { PackageService } from '@/types/packageService'
import Swal from 'sweetalert2'
import { AVAILABLE } from '../../constants/statusProperty.constant'
import { getProfile } from '../../service/ProfileService'
import { updateStatusPropertiesForSeller } from '../../service/SellerService'
import { User } from '@/types/user'
import { Properties } from '@/types'
import { RENEW } from '../../constants/actions.constant'

interface Props {
  selectedProperty: Properties | null
  setShouldUpdate?: React.Dispatch<React.SetStateAction<boolean>>
  closePackageService: () => void
  actionRental: string
}
function ModalPackageService({
  selectedProperty,
  actionRental,
  setShouldUpdate,
  closePackageService,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [packageServiceSelected, setPackageServiceSelected] = useState('')
  const [pricePackageServiceSelected, setPricePackageServiceSelected] =
    useState<number>()
  const [packageServiceList, setPackageServiceList] = useState<
    PackageService[]
  >([])
  const getAllPackageService = async () => {
    const res = await getAllRentalPackageService()
    setPackageServiceList(res.data.metaData)
  }
  useEffect(() => {
    getAllPackageService()
  }, [])
  // Get userProfile to get current credit.
  const [userProfile, setUserProfile] = useState<User | undefined>()
  const getUserProfile = async () => {
    const res = await getProfile()
    setUserProfile(res)
  }
  useEffect(() => {
    getUserProfile()
  }, [])
  const handleRenewProperty = async (property: Properties | null) => {
    if (!packageServiceSelected) {
      return
    }
    if (property) {
      if (
        userProfile?.balance &&
        Number(userProfile.balance) >= Number(pricePackageServiceSelected!)
      ) {
        try {
          setIsLoading(true)
          await updateStatusPropertiesForSeller(
            property.propertyId,
            AVAILABLE,
            Number(packageServiceSelected),
          )
          closePackageService()
          Swal.fire({
            icon: 'success',
            title: 'Renew successfully!',
            text: 'This property is now available.',
          })
          setShouldUpdate!((prev) => !prev)
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      } else {
        Swal.fire({
          icon: 'error',
          text: 'You have insufficient balance',
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
      })
    }
  }
  return (
    <div>
      {actionRental === RENEW && (
        <div className={style.message}>
          Your property&apos;s effective day is expired. Please, choose a
          package to renew.
        </div>
      )}

      <div className="mt-4">
        <Radio.Group
          value={packageServiceSelected}
          onChange={(value) => {
            setPackageServiceSelected(value)
          }}
          withAsterisk
          label={
            actionRental === RENEW
              ? 'How long do you want to renew this property?'
              : 'How long do you want to extend this property?'
          }
          className="text-base"
          classNames={{
            root: style.radioGroupRoot,
            label: style.radioGroupLabel,
          }}
        >
          <Group classNames={{ root: style.groupRoot }}>
            {packageServiceList.length > 0 &&
              packageServiceList.map((item) => (
                <Radio
                  onChange={() => setPricePackageServiceSelected(item.price)}
                  key={item.serviceId}
                  value={String(item.serviceId)}
                  label={`${item.serviceName} - ${Number(item.price)} credits`}
                />
              ))}
          </Group>
        </Radio.Group>
      </div>
      <div className="flex justify-center">
        <Button
          loading={isLoading}
          classNames={{ root: style.renewBtn }}
          size="sm"
          onClick={() => {
            if (selectedProperty) {
              handleRenewProperty(selectedProperty)
            } else {
              handleRenewProperty(null)
            }
          }}
        >
          {actionRental === RENEW ? 'Renew' : 'Purchase'}
        </Button>
      </div>
    </div>
  )
}

export default ModalPackageService
