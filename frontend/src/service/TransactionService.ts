import axios from "axios";
import { axiosInstance } from "./AxiosInstance";
import qs from 'qs'

export async function getConversionRateList() {
    const res = await axios.get('/conversion-rate')
    return res.data.metaData
}

export async function proceedToPayment(amountInDollars: number, amountInCredits:number, exchangeRate: number, description?: string) {
    const res = await axiosInstance.post('/seller/transaction/deposit', {amountInDollars, amountInCredits,exchangeRate, description})

    return res.data
}

export async function getTransactionHistory(
  fromDateRange?:string | null, 
  toDateRange?:string | null,
  page?: number | null,
  limit?: number | null
  ) { 
      const queryString = qs.stringify({fromDateRange, toDateRange, page, limit}, {
    skipNulls: true,
    addQueryPrefix: true,
    encode: false,
  }) 
  

const res = await axiosInstance.get(`/seller/transaction/deposit${queryString}`) 
    return res.data.metaData
}