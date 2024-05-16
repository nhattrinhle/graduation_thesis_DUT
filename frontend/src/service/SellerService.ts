import { SearchProps } from '@/types/searchProps'
import qs from 'qs'
import { axiosInstance } from './AxiosInstance'
import { Properties } from '@/types'


export async function getTransactionRentService(
  fromDateRange?: string | null,
  toDateRange?: string | null,
  page?: number | null,
  limit?: number | null
) {
  const queryString = qs.stringify(
    { fromDateRange, toDateRange, page, limit },
    {
      skipNulls: true,
      addQueryPrefix: true,
      encode: false,
    },
  )

  const res = await axiosInstance.get(`/seller/transaction/rent-service${queryString}`)

  return res.data.metaData
}

export const getAllPropertiesForSeller = async () => {
  const res = await axiosInstance.get('/seller/properties')
  return res
}

export const deletePropertiesForSeller = async (listPropertyId:string) => {
  const res = await axiosInstance.delete(`/seller/properties?propertyId=${listPropertyId}`)
  return res
}

export const updateStatusPropertiesForSeller = async (
  propertyId: number,
  status: string,
  serviceId?: number
) => {
  const res = await axiosInstance.patch(
    `/seller/properties/${propertyId}/status`,
    { status, serviceId },
  )
  return res
}
export async function searchPropertyForSeller(searchValues: SearchProps) {
  const queryString = qs.stringify(searchValues, {
    skipNulls: true,
    addQueryPrefix: true,
    encode: false,
  })
  const res = await axiosInstance.get(`/seller/properties${queryString}`)
  return res
}

export const AddNewPropertyForSeller = async (
  propertyData: Properties,
  option: object,
) => {
  const res = await axiosInstance.post(`/seller/properties`, {
    propertyData,
    option,
  })
  return res
}

export const updatePropertyForSeller = async (propertyId:number, value:any) =>{
  const res = await axiosInstance.patch(`/seller/properties/${propertyId}`,value)
  return res
}

export async function getPropertiesCountedByFeature(){
  const res = await axiosInstance.get("/seller/report/count-properties-by-feature")
  return res.data
}

export async function getPropertiesCountedByCategory(){
  const res = await axiosInstance.get("/seller/report/count-properties-by-category")
  return res.data
}

export const getPropertiesCountedByDate = async (fromDateRange : string| null, toDateRange :string) => {
  const res = await axiosInstance.get(`/seller/report/count-properties-created-by-date?fromDateRange=${fromDateRange}&toDateRange=${toDateRange}`)
  return res.data
}

export async function getTotalAmountDepositedByDate(fromDateRange : string| null, toDateRange :string ){
  const res = await axiosInstance.get(`/seller/report/total-amount-deposited-by-date?fromDateRange=${fromDateRange}&toDateRange=${toDateRange}`)
  return res.data
}

export const getContactsCountedByDate = async (fromDateRange : string| null, toDateRange :string) => {
  const res = await axiosInstance.get(`/seller/report/count-contacts-by-date?fromDateRange=${fromDateRange}&toDateRange=${toDateRange}`)
  return res.data
}

export async function getTotalCreditsUsedByDate(fromDateRange : string| null, toDateRange :string){
  const res = await axiosInstance.get(`/seller/report/total-credits-used-by-date?fromDateRange=${fromDateRange}&toDateRange=${toDateRange}`)
  return res.data
}

export async function getTotalAmountDeposited(){
  const res = await axiosInstance.get("/seller/report/total-amount-deposited")
  return res.data
}

export async function getTotalCreditsUsed(){
  const res = await axiosInstance.get("/seller/report/total-credits-used")
  return res.data
}

export async function getTotalContacts(){
  const res = await axiosInstance.get("/seller/report/total-contacts")
  return res.data
}