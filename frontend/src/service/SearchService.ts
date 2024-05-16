import axios from 'axios'
import qs from 'qs'
import {NUM_OF_RETURN_ELEMENTS, NUM_OF_RETURN_ELEMENTS_FOR_CAROUSEL} from '../constants/numOfReturnElements.constant'
import { SearchProps } from '../types/searchProps'

export async function searchProperty(
  searchValues: SearchProps,
  isAll?: boolean,
) {
  const queryString = qs.stringify(searchValues, {
    skipNulls: true,
    addQueryPrefix: true,
    encode: false,
  })
  

  const res = await axios.get(
    `/properties${queryString}${queryString.length === 0 
      ? `?limit=${isAll ? NUM_OF_RETURN_ELEMENTS_FOR_CAROUSEL : NUM_OF_RETURN_ELEMENTS}` 
      : `&limit=${isAll ? NUM_OF_RETURN_ELEMENTS_FOR_CAROUSEL : NUM_OF_RETURN_ELEMENTS}`}`,
  )
  

  return res.data.metaData
}

export async function getMaxPrice() {
  const res = await axios.get('/properties/max-price')
  return res.data
}




