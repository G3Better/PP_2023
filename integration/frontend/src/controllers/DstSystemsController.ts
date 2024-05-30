import { deleteRequest, getRequest, postRequest, putRequest } from "../axios/http"

export const getDstSystems = async () => {
    const data = await getRequest('/api/dst_systems');
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

export const getIps = async () => {
    const data = await getRequest('/api/ips');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const deleteDstSystems = async (id: string) => {
    const data = await deleteRequest(`/api/dst_systems/delete/${id}`, {}, { id });
    if (data) {
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editDstSystems = async (id: number, name: string, responsible: number, test: string, test_ip: number, cert: string, cert_ip: number, prod: string, prod_ip: number) => {
    const res = await putRequest(`/api/dst_systems/edit/${id}`, {}, { id, name, responsible, test, test_ip, cert, cert_ip, prod, prod_ip });
    if (res) {
        return res;
    } else {
        return "Не получилось отредактировать";
    }
};

export const addDstSystems = async (name: string, responsible: number, test: string, test_ip: number, cert: string, cert_ip: number, prod: string, prod_ip: number) => {
    const res = await postRequest(`/api/dst_systems/add`, {}, { name, responsible, test, test_ip, cert, cert_ip, prod, prod_ip });
    if (res) {
        getDstSystems()
        return res;
    } else {
        return "Не получилось добавить новое бронирование";
    }
};
