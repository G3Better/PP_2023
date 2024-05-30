import { deleteRequest, getRequest, postRequest, putRequest } from "../axios/http"

export const getIps = async () => {
    const data = await getRequest('/api/ips');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const deleteIps = async (id: string) => {
    const data = await deleteRequest(`/api/ips/delete/${id}`, {}, { id });
    if (data) {
        getIps()
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editIps = async (id: number, name: string, desc: string) => {
    const res = await putRequest(`/api/ips/edit/${id}`, {}, { id, name, desc });
    if (res) {
        getIps()
        return res;
    } else {
        return "Не получилось отредактировать";
    }
};

export const addIps = async (name: string, desc: string) => {
    const res = await postRequest(`/api/ips/add`, {}, { name, desc });
    if (res) {
        getIps()
        return res;
    } else {
        return "Не получилось добавить новое ip";
    }
};
