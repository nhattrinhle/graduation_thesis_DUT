import React, { useState } from 'react'
import { FaLocationDot, FaRegHeart } from 'react-icons/fa6'
import { Properties as PropertiesType } from '@/types'
import style from './styles.module.scss'
import { axiosInstance } from '../../service/AxiosInstance'
import { FaHeart } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getAllWishList } from '../../redux/reducers/propertySlice'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { Button, Tooltip } from '@mantine/core'
import { formatMoneyToUSD } from '../../utils/commonFunctions'
import area from '../../assets/images/area.png'
import bedroom from '../../assets/images/bed.png'
import { AVAILABLE } from '../../constants/statusProperty.constant'
import UnderMaintenance from '../UnderMaintenance/UnderMaintenance'
import { getMaintenanceModeForSeller } from '../../service/MaintenanceService'

interface Props {
  data: PropertiesType
}

const Properties = ({ data }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const loggedIn = useAppSelector((state) => state.session.signedIn)

  const wishList: PropertiesType[] = useAppSelector(
    (state) => state.property.listFavorites,
  )
  const dispatch = useAppDispatch()
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')

  const handleGetMaintenanceMode = async () => {
    try {
      const res = await getMaintenanceModeForSeller()
      setIsUnderMaintenance((_prev) => res.metaData.isMaintenance)
      setMaintenanceMessage((_prev) => res.metaData.description)
      return res.metaData.isMaintenance
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddToWishlist = async (propertyId: number) => {
    if (!loggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'You need to login first!',
        showConfirmButton: false,
        timer: 1400,
      })
      return
    }

    const maintenanceStatus = await handleGetMaintenanceMode()
    if (maintenanceStatus === true) return

    try {
      setIsLoading(true)
      await axiosInstance.post(`/favorites-list`, { propertyId })
      await dispatch(getAllWishList())
    } catch (error: any) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={style.propertyContainer}>
      <div
        className={
          data.status === AVAILABLE ? 'hidden' : style.propertyDisabled
        }
      ></div>
      <div className={style.propertyContent}>
        <div
          className={`${style.propertyFeatured} ${data.feature.featureId === 1 ? 'bg-labelBlue' : 'bg-emerald-700'}`}
        >
          {data.feature.name}
        </div>
        <div className={style.propertyCoverImage}>
          <Link to={`/details/${data.propertyId}`} key={data.propertyId}>
            {data.images.length > 0 ? (
              <img
                className={style.propertyImage}
                src={data.images[0].imageUrl}
                alt={data.name}
              />
            ) : (
              <img className={style.propertyImage} alt={data.name} />
            )}
          </Link>
        </div>
        <div className="w-full">
          <div className={style.propertyName}>
            <Tooltip label={data.name}>
              <Link
                to={`/details/${data.propertyId}`}
                key={data.propertyId}
                className={style.propertyNameLink}
              >
                {data.name}
              </Link>
            </Tooltip>
          </div>
          <div className={style.propertyLocation}>
            <div className="flex truncate">
              <span>
                <FaLocationDot className={style.propertyIcon} size={20} />
              </span>
              <Tooltip label={data.location.address}>
                <span className={style.propertyDetailLocation}>
                  {data.location.address
                    ? data.location.address
                    : data.location.street}
                </span>
              </Tooltip>
            </div>
            {/* This comment has been kept as a temporary if there are any errors.
            {user !== null ? (
              wishList.filter(
                (property: PropertiesType) =>
                  property.propertyId === data.propertyId,
              ).length > 0 ? (
                <span
                  className={style.heartIsAdded}
                  onClick={() => handleAddToWishlist(data.propertyId)}
                >
                  <FaHeart size={24} />
                </span>
              ) : isAddedWishlist ? (
                <span
                  className={style.heartIsAdded}
                  onClick={() => handleAddToWishlist(data.propertyId)}
                >
                  <FaHeart size={24} />
                </span>
              ) : (
                <span
                  className={style.heartCoverIcon}
                  onClick={() => handleAddToWishlist(data.propertyId)}
                >
                  <FaRegHeart size={24} />
                </span>
              )
            ) : (
              <span
                className={style.heartCoverIcon}
                onClick={() => handleAddToWishlist(data.propertyId)}
              >
                <FaRegHeart size={24} />
              </span>
            )} */}
            <span>
              {loggedIn &&
              wishList &&
              wishList.find(
                (property: PropertiesType) =>
                  property.propertyId === data.propertyId,
              ) ? (
                <Tooltip label="Remove from wishlist">
                  <Button
                    loading={isLoading}
                    className={style.heartIsAdded}
                    onClick={() => handleAddToWishlist(data.propertyId)}
                  >
                    <FaHeart size={20} />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip label="Add to wishlist">
                  <Button
                    loading={isLoading}
                    className={style.heartIsAdded}
                    onClick={() => handleAddToWishlist(data.propertyId)}
                  >
                    <FaRegHeart size={20} />
                  </Button>
                </Tooltip>
              )}
            </span>
          </div>

          {data.feature.name === 'Rent' ? (
            <div className={`${style.propertyPrice} bg-emerald-600`}>
              {formatMoneyToUSD(data.price)} {data.currencyCode}/month
              <div
                className={
                  data.status === AVAILABLE ? 'hidden' : style.propertyStatus
                }
              >
                UNAVAILABLE
              </div>
            </div>
          ) : (
            <div className={`${style.propertyPrice} bg-lightBlue`}>
              {formatMoneyToUSD(data.price)} {data.currencyCode}
              <div
                className={
                  data.status === AVAILABLE ? 'hidden' : style.propertyStatus
                }
              >
                UNAVAILABLE
              </div>
            </div>
          )}
          <div className={style.propertyDescription}>
            <span className={style.propertyDesIcon}>
              <img src={area} className="w-4 h-auto mr-2" />
              {data.areaOfUse} m²
            </span>
            <span className={style.propertyDesIcon}>
              <img src={bedroom} className="w-5 h-auto mr-2" />
              {data.numberOfBedRoom}
            </span>
          </div>
        </div>
      </div>
      <UnderMaintenance
        status={isUnderMaintenance}
        setStatus={setIsUnderMaintenance}
        maintenanceMessage={maintenanceMessage}
      />
    </div>
  )
}

export default Properties
