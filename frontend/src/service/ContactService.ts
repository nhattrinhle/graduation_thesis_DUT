import axios from "axios";

interface ContactProps{
    propertyId:number,
    sellerId:number,
    name:string,
    email:string,
    phone:string,
    message:string
}
export async function sendContactToSeller(contact:ContactProps) {
    const res = await axios.post(`/contact`, contact)
    return res.data 
}