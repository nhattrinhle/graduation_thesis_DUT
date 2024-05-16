import React, { useEffect, useRef, useState } from 'react'
import {
  REACT_APP_GOOGLE_MAP_ID_HOANG,
  REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY_HOANG,
} from '../../constants/google.constant'
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps'
import { Marker, MarkerClusterer } from '@googlemaps/markerclusterer'
import { TbBuildingWarehouse } from 'react-icons/tb'
import { IMarker, RawMarker } from '../../types/propertyMarkerMap'
import style from './MapProperties.module.scss'
import { Properties } from '@/types'
import { getAllPropertiesService } from '../../service/PropertyService'

const MapProperties = () => {
  const [propertiesList, setPropertiesList] = useState<Properties[]>([])
  const [markers, setMarkers] = useState<RawMarker[]>([])
  const getAllProperties = async () => {
    const res = await getAllPropertiesService()
    setPropertiesList(res.data.metaData.data)
  }
  useEffect(() => {
    getAllProperties()
  }, [])

  useEffect(() => {
    fetchData()
  }, [propertiesList])

  const fetchData = () => {
    const tempMarkers: RawMarker[] = propertiesList.map(
      (property: Properties) => [
        property.name,
        Number(property.location.lat),
        Number(property.location.lng),
      ],
    )
    return setMarkers(tempMarkers)
  }

  const [formattedMarkers, setFormattedMarkers] = useState<IMarker[]>()
  const convertData = () => {
    const formatted = markers.map(([name, lat, lng]) => ({
      name,
      lat,
      lng,
      key: JSON.stringify({ name, lat, lng }),
    }))
    return setFormattedMarkers(formatted)
  }
  useEffect(() => {
    convertData()
  }, [markers])

  return (
    <div className={style.container}>
      <div className={style.googleMaps}>
        <APIProvider
          language="en"
          apiKey={REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY_HOANG!}
        >
          <Map
            defaultCenter={{ lat: 16.047079, lng: 108.20623 }}
            defaultZoom={5.8}
            mapId={REACT_APP_GOOGLE_MAP_ID_HOANG!}
          >
            <Markers points={formattedMarkers!}></Markers>
          </Map>
        </APIProvider>
      </div>
    </div>
  )
}

export default MapProperties

type Point = google.maps.LatLngLiteral & { key: string }
type Props = { points: Point[] }
const Markers = ({ points }: Props) => {
  const map = useMap()
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({})
  const clusterer = useRef<MarkerClusterer | null>(null)

  useEffect(() => {
    if (!map) return
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map })
    }
  }, [map])

  useEffect(() => {
    clusterer.current?.clearMarkers()
    clusterer.current?.addMarkers(Object.values(markers))
  }, [markers])

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return
    if (!marker && !markers[key]) return
    setMarkers((prev) => {
      if (marker) {
        return {
          ...prev,
          [key]: marker,
        }
      } else {
        const newMarkers = { ...prev }
        delete newMarkers[key]
        return newMarkers
      }
    })
  }

  return (
    <>
      {points.map((point, index) => (
        <AdvancedMarker
          key={index}
          position={point}
          ref={(marker) => setMarkerRef(marker, point.key)}
        >
          <Pin>
            <TbBuildingWarehouse color="white" size={12} />
          </Pin>
        </AdvancedMarker>
      ))}
    </>
  )
}
