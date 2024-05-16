import axios from 'axios'

export const getAllRentalPackageService = async () => {
  const res = await axios.get(`/services`)
  return res
}
