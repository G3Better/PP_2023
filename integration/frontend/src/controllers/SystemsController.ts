import { deleteRequest, getRequest, postRequest, putRequest } from "../axios/http"

export const getSystems = async () => {
    const data = await getRequest('/api/systems');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getResponsible = async () => {
    const data = await getRequest('/api/responsible');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const deleteSystems = async (id: string) => {
    const data = await deleteRequest(`/api/systems/delete/${id}`, {}, { id });
    if (data) {
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editSystems = async (id: number, name: string, responsible: number, ip: string) => {
    const res = await putRequest(`/api/systems/edit/${id}`, {}, { id, name, responsible, ip });
    if (res) {
        return res;
    } else {
        return "Не получилось отредактировать";
    }
};

export const addSystems = async (name: string, responsible: number, ip: string) => {
    const res = await postRequest(`/api/systems/add`, {}, { name, responsible, ip });
    if (res) {
        getSystems()
        return res;
    } else {
        return "Не получилось добавить новое бронирование";
    }
};
