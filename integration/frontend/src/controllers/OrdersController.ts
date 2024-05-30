import { deleteRequest, getRequest, postRequest, putRequest } from "../axios/http"

export const getSrcSystem = async () => {
    const data = await getRequest('/api/src_systems_order');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getDstSystem = async () => {
    const data = await getRequest('/api/dst_systems_order');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getCustomer = async () => {
    const data = await getRequest('/api/users_order');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getRequestRate = async () => {
    const data = await getRequest('/api/requests_rate');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getStatus = async () => {
    const data = await getRequest('/api/statuses');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getAuthorization = async () => {
    const data = await getRequest('/api/authorization');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getOrders = async () => {
    const data = await getRequest('/api/orders');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const deleteOrders = async (id: string) => {
    const data = await deleteRequest(`/api/orders/delete/${id}`, {}, { id });
    if (data) {
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editOrders = async (id: number, source_system: number, dest_system: number, request_rate: number, status: number, authorization: number, customer: number, description: number, swagger: number) => {
    const res = await putRequest(`/api/orders/edit/${id}`, {}, { id, source_system, dest_system, request_rate, status, authorization, customer, description, swagger });
    if (res) {
        return res;
    } else {
        return "Не получилось отредактировать";
    }
};

export const addOrders = async (source_system: number, dest_system: number, request_rate: number, status: number, authorization: number, customer: number, description: number, swagger: number) => {
    const res = await postRequest(`/api/orders/add`, {}, { source_system, dest_system, request_rate, status, authorization, customer, description, swagger });
    if (res) {
        getOrders()
        return res;
    } else {
        return "Не получилось добавить новую заявку";
    }
};
