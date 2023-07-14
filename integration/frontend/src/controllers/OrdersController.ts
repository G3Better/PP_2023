import { deleteRequest, getRequest, postRequest, putRequest } from "../axios/http"

export const getOrders = async () => {
    const data = await getRequest('/api/orders');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getSourceSystems = async () => {
    const data = await getRequest('/api/source_systems');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getDistSystems = async () => {
    const data = await getRequest('/api/dist_systems');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getAuthorizations = async () => {
    const data = await getRequest('/api/authorizations');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getRequestsRates = async () => {
    const data = await getRequest('/api/requests_rates');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getStatuses = async () => {
    const data = await getRequest('/api/statuses');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getCustomers = async () => {
    const data = await getRequest('/api/customers');
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

export const editOrders = async (id: number, source_system: string, destination_system: string, customer: string, autorization: string, requests_rate: string, status: string, description: string) => {
    const res = await putRequest(`/api/orders/edit/${id}`, {}, { id, source_system, destination_system, customer, autorization, requests_rate, status, description });
    if (res) {
        return res;
    } else {
        return "Не получилось отредактировать";
    }
};

export const addOrders = async (source_system: string, destination_system: string, customer: string, autorization: string, requests_rate: string, status: string, description: string) => {
    console.log("Что-то 3");
    const res = await postRequest(`/api/orders/add`, {}, { source_system, destination_system, customer, autorization, requests_rate, status, description });
    if (res) {
        const res2 = await getOrders()
        return res2;
    } else {
        return "Не получилось добавить новое бронирование";
    }
};
