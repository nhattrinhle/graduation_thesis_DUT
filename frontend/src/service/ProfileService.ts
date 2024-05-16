import { axiosInstance } from './AxiosInstance'
import axios from 'axios'

export async function getProfile() {
    const res = await axiosInstance.get('/user/profile')
    return res.data.metaData
}

export async function uploadAvatarToCloudinary(formData: FormData) {
  const res = await axios.post(
    'https://api.cloudinary.com/v1_1/modernhouse/image/upload',
    formData,
    {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    },
  )
  return res.data
}

export async function uploadAvatar(imageUrl: string | null) {
  const res = await axiosInstance.post(`/user/update-avatar`, {
    imageUrl: imageUrl ? imageUrl : 'null',
  })
  return res.data
}

export async function changePassword(values: object) {
  const res = await axiosInstance.post('/user/change-password', { ...values })
  return res.data
}

export async function updateProfile(updatedInfo: any) {
  const res = await axiosInstance.patch('/user/profile', { ...updatedInfo })
  return res.data
}
