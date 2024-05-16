import { axiosInstance } from "./AxiosInstance";

export async function upgradeToSeller(userInfo: object) {
    const res = await axiosInstance.post('/user/upgrade-seller', { ...userInfo })
    return res.data
}

export async function logOut(refreshToken: string) {
    const res = await axiosInstance.post('/user/logout', { refreshToken })
    return res.data
}