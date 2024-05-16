import { SearchProps } from '@/types/searchProps'
import qs from 'qs'
import { axiosInstance } from './AxiosInstance'
import { SearchUsers } from '@/types/searchUsers'

export const getPropertiesForAdminService = async (
  searchValues: SearchProps,
) => {
  const queryString = qs.stringify(searchValues, {
    skipNulls: true,
    addQueryPrefix: true,
    encode: false,
  })
  const res = await axiosInstance.get(`/admin/manage-property${queryString}`)
  return res
}

export const getAllPropertiesForAdminSerivce = async () => {
  const res = await axiosInstance.get(`/admin/manage-property`)
  if (res.data) {
    return res.data
  }
}

export const updateStatusPropertyForAdminService = async (
  propertyId: number,
  status: string | null,
) => {
  const res = await axiosInstance.patch(
    `/admin/manage-property/${propertyId}/status`,
    { status },
  )
  return res
}

// This comment can be used in future.
// export const getAllUsersForAdminService = async () => {
//   const res = await axiosInstance.get(`/admin/manage-user`)
//   if (res.data) {
//     return res.data
//   }
// }

export const getAllUsersForAdmin = async (roleId: number) => {
  const res = await axiosInstance.get(`/admin/manage-user?roleId=${roleId}`)
  if (res.data) {
    return res.data
  }
}

export const getUsersForAdminService = async (searchValues: SearchUsers) => {
  const queryString = qs.stringify(searchValues, {
    skipNulls: true,
    addQueryPrefix: true,
    encode: false,
  })
  const res = await axiosInstance.get(`/admin/manage-user${queryString}`)
  if (res.data) {
    return res.data
  }
}

export const updateStatusUserForAdminService = async (userId: number) => {
  const res = axiosInstance.patch(`/admin/manage-user/${userId}/active`)
  return res
}

export const updateUserProfileForAdminService = async (
  updateUser: any,
  userId: number,
) => {
  const res = axiosInstance.patch(`/admin/manage-user/${userId}`, {
    ...updateUser,
  })
  return res
}

export const deleteUserForAdminService = async (listUserId: string) => {
  const res = axiosInstance.delete(`/admin/manage-user?userId=${listUserId}`)
  return res
}

export const deletePropertyForAdminService = async (listPropertyId: string) => {
  const res = await axiosInstance.delete(
    `/admin/manage-property?propertyId=${listPropertyId}`,
  )
  return res
}

export async function getAllTransactions(
  fromDateRange?: string | null,
  toDateRange?: string | null,
  page?: number,
  userId?: string | null,
) {
  const queryString = qs.stringify(
    { fromDateRange, toDateRange, page, userId },
    {
      skipNulls: true,
      addQueryPrefix: true,
      encode: false,
    },
  )

  const res = await axiosInstance.get(
    `/admin/manage-transaction/deposit${queryString}`,
  )
  return res.data.metaData
}
// This comment is used to compare with above functions.
// export async function getAllTransactions(
//   fromDateRange?: string | null,
//   toDateRange?: string | null,
//   page?: number,
// ) {
//   const queryString = qs.stringify(
//     { fromDateRange, toDateRange, page },
//     {
//       skipNulls: true,
//       addQueryPrefix: true,
//       encode: false,
//     },
//   )

//   const res = await axiosInstance.get(
//     `/admin/manage-transaction/deposit${queryString}`,
//   )

//   return res.data.metaData
// }

export async function getAllConversionRates() {
  const res = await axiosInstance.get('/admin/manage-conversion-rate')
  return res.data.metaData
}

export async function addNewCurrencyRate(
  currencyFrom: string,
  currencyTo: string,
  exchangeRate: number,
) {
  const res = await axiosInstance.post('/admin/manage-conversion-rate', {
    currencyFrom,
    currencyTo,
    exchangeRate,
  })
  return res
}

export async function editConversionRate(
  conversionRateId: number,
  newExchangeRate: number,
) {
  const res = await axiosInstance.patch(
    `/admin/manage-conversion-rate/${conversionRateId}`,
    { newExchangeRate },
  )
  return res
}

export async function deleteConversionRate(conversionRateId: number) {
  const res = await axiosInstance.delete(
    `/admin/manage-conversion-rate/${conversionRateId}`,
  )
  return res
}

export const disablePropertyForAdminService = async (
  listPropertyId: string,
) => {
  const res = await axiosInstance.patch(
    `/admin/manage-property/disable?propertyId=${listPropertyId}`,
  )
  return res
}

export const resetPasswordForAdmin = async (userId: number) => {
  const res = await axiosInstance.post(
    `/admin/manage-user/${userId}/reset-password`,
  )
  return res
}

export async function getPropertiesCountedByFeature() {
  const res = await axiosInstance.get(
    '/admin/report/count-properties-by-feature',
  )
  return res.data
}

export async function getPropertiesCountedByCategory() {
  const res = await axiosInstance.get(
    '/admin/report/count-properties-by-category',
  )
  return res.data
}


export const getPropertiesCountedByDate = async (fromDateRange : string| null, toDateRange :string) => {
  const res = await axiosInstance.get(`/admin/report/count-properties-created-by-date?fromDateRange=${fromDateRange}&toDateRange=${toDateRange}`)
  return res.data
}

export const getContactsCountedByDate = async (fromDateRange : string| null, toDateRange :string) => {
  const res = await axiosInstance.get(`/admin/report/count-contacts-by-date?fromDateRange=${fromDateRange}&toDateRange=${toDateRange}`)
  return res.data
}

export async function getTotalAmountDeposited(){
  const res = await axiosInstance.get("/admin/report/total-amount-deposited")
  return res.data
}

export async function getTotalAmountDepositedByDate(fromDateRange : string| null, toDateRange :string ){
  const res = await axiosInstance.get(`/admin/report/total-amount-deposited-by-date?fromDateRange=${fromDateRange}&toDateRange=${toDateRange}`)
  return res.data
}

export async function getTotalCreditsUsedByDate(fromDateRange : string| null, toDateRange :string){
  const res = await axiosInstance.get(`/admin/report/total-credits-used-by-date?fromDateRange=${fromDateRange}&toDateRange=${toDateRange}`)
  return res.data
}

export async function getTotalAccountsByRole(){
  const res = await axiosInstance.get("/admin/report/total-accounts-by-role")
  return res.data
}

export async function countPropertiesByFeatureCategory(){
  const res = await axiosInstance.get("/admin/report/count-properties-by-feature-category")
  return res.data
}

export const AdminDepositForUser = async (
  userId: number,
  amountInDollars: number,
  amountInCredits: number,
  exchangeRate: number,
) => {
  const res = await axiosInstance.post(
    `/admin/manage-transaction/deposit/${userId}`,
    {
      amountInDollars,
      amountInCredits,
      exchangeRate,
    },
  )
  return res
}
