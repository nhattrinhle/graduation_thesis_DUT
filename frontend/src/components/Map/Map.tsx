import React, { useEffect, useState } from 'react'
import styles from './Map.module.scss'
import { Box, LoadingOverlay } from '@mantine/core'
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from '@vis.gl/react-google-maps'
import {
  REACT_APP_GOOGLE_MAP_ID_HOANG,
  REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY_HOANG,
} from '../../constants/google.constant'
import { geocode } from '../../service/MapsService'
import { TbBuildingWarehouse } from 'react-icons/tb'

interface Props {
  location: string | undefined
}
export default function MapComponent({ location }: Props) {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)

  const getLatLng = async () => {
    if (location) {      
      try {
        setIsLoading(true)
        setIsUpdated(false)
        const res = await geocode(location)
        setPosition({
          lat: res.data.results[0].geometry.location.lat,
          lng: res.data.results[0].geometry.location.lng,
        })
        setIsUpdated((prev) => !prev)        
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
      <hr />
      <h1 className={styles.mapFont}>GOOGLE MAP</h1>
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading}
          zIndex={10}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
          <APIProvider apiKey={REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY_HOANG!}>
            {isUpdated && (
              <Map
                style={{ width: '100%', height: '300px' }}
                defaultCenter={position}
                defaultZoom={14}
                mapId={REACT_APP_GOOGLE_MAP_ID_HOANG!}
              >
                <AdvancedMarker position={position}>
                  <Pin>
                    <TbBuildingWarehouse color="white" size={18} />
                  </Pin>
                </AdvancedMarker>
              </Map>
            )}
          </APIProvider>
      </Box>
    </div>
  )
}
