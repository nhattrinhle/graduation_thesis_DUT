import axios from "axios";
import { axiosInstance } from "./AxiosInstance";

export async function getMaintenanceMode() {
    const res = await axiosInstance.get('/admin/manage-maintenance-mode')
    return res.data
}

export async function updateMaintenanceMode(isMaintenance: boolean, description:string) {
    const res = await axiosInstance.patch('/admin/manage-maintenance-mode',{isMaintenance, description})
    return res.data
}

export async function getMaintenanceModeForSeller() {
    const res = await axios.get('/maintenance-mode')
    return res.data
}
