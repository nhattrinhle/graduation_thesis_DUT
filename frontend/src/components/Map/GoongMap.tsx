import React, { useEffect, useState } from 'react'
import ReactMapGL from '@goongmaps/goong-map-react'
import '@goongmaps/goong-js/dist/goong-js.css'
import { geocoding } from '../../service/MapsService'
import styles from './Map.module.scss'
import { Box, LoadingOverlay } from '@mantine/core'

interface Props {
  location: string | undefined
}

const GoongMap = ({ location }: Props) => {
  const [lat, setLat] = useState(21.028511)
  const [lng, setLng] = useState(105.804817)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)
  const [viewport, setViewport] = useState({
    latitude: lat,
    longitude: lng,
    zoom: 12,
  })

  const getLatLng = async () => {
    if (location) {
      try {
        setIsUpdated(false)
        setIsLoading(true)
        const res = await geocoding(location.concat('100 Cô Giang, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam,100 Cô Giang, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam'))
        setLng((_prev) => res.data.features[0].geometry.coordinates[0])
        setLat((_prev) => res.data.features[0].geometry.coordinates[1])

        setViewport((_prv) => ({
          latitude: lat,
          longitude: lng,
          zoom: 12,
        }))
        setIsUpdated((_prev) => true)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
  }
  useEffect(() => {
    getLatLng()
  }, [location])
  return (
    <div className={styles.mapContainer}>
      <h1 className={styles.mapFont}>Maps</h1>
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading}
          zIndex={2}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
        {isUpdated && (
          <ReactMapGL
            width="100%"
            height="500px"
            goongApiAccessToken="TtkbxWBy1ZVgMCSxvcGyR98W8GyXSw41CCNJpBzq"
            {...viewport}
            onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
          />
        )}
      </Box>
    </div>
  )
}

export default GoongMap
