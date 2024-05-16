import { REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY_HOANG } from '../constants/google.constant'
import axios from 'axios'

export const geocode = async (location: string) => {
  const res = await axios.get(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {
      params: {
        address: location,
        key: REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY_HOANG,
      },
    },
  )  
  return res
}

export const geocoding = async (location: string) => {
  const res = await axios.get(
    `https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=28989c85c4f946e6acf0d9624ae6ebcf`,
  )
  return res
}
