import axios from "axios";
export const URI = "http://localhost:5000";

export const getRequest = async (url: string, headers: any = {}, body: any = {}) => {
    try {
        const data = await axios.get(`${URI}${url}`, headers);
        return data.data
    } catch (err) {
        console.error('err in method getRequest', err)
        return 'Произошли технические шоколадки'
    }
}
export const postRequest = async (url: string, headers: any = {}, body: any = {}) => {
    try {
        const data = await axios.post(`${URI}${url}`, body, headers)
        return data.data
    } catch (err) {
        console.error('err in method postRequest', err)
        return 'Произошли технические шоколадки'
    }
}
export const putRequest = async (url: string, headers: any = {}, body: any = {}) => {
    try {
        const data = await axios.put(`${URI}${url}`, body, headers);
        return data.data
    } catch (err) {
        console.error('err in method putRequest', err)
        return 'Произошли технические шоколадки'
    }
}
export const deleteRequest = async (url: string, headers: any = {}, body: any = {}) => {
    try {
        const data = await axios.delete(`${URI}${url}`, {
            headers: headers,
            data: body
        })
        return data.data
    } catch (err) {
        console.error('err in method deleteRequest', err)
        return 'Произошли технические шоколадки'
    }
}