import { deleteRequest, getRequest, postRequest, putRequest } from "../axios/http"

export const getGamePlaces = async () => {
    const data = await getRequest('/api/game_places');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getComputer = async () => {
    const data = await getRequest('/api/computers');
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

export const getCategory = async () => {
    const data = await getRequest('/api/game_places_category');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const deleteGamePlaces = async (id: string) => {
    const data = await deleteRequest(`/api/game_places/delete/${id}`, {}, { id });
    if (data) {
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editGamePlaces = async (id: number, name: string, cost: number, computer: string, status: string, category: string) => {
    const res = await putRequest(`/api/game_places/edit/${id}`, {}, { id, name, cost, computer, status, category });
    if (res) {
        return res;
    } else {
        return "Не получилось отредактировать";
    }
};

export const addGamePlaces = async (name: string, cost: number, computer: string, status: string, category: string) => {
    const res = await postRequest(`/api/game_places/add`, {}, { name, cost, computer, status, category });
    if (res) {
        getGamePlaces()
        return res;
    } else {
        return "Не получилось добавить новое бронирование";
    }
};
