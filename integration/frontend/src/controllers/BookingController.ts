import { deleteRequest, getRequest, postRequest, putRequest } from "../axios/http"

export const getBooking = async () => {
    const data = await getRequest('/api/booking');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const getPlaces = async () => {
    const data = await getRequest('/api/game_places_model');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const deleteBooking = async (id: string) => {
    const data = await deleteRequest(`/api/booking/delete/${id}`, {}, { id });
    if (data) {
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editBooking = async (id: number, Incoming_DateTime: string, FIO: string, Rental_Time: string, game_place: string) => {
    const res = await putRequest(`/api/booking/edit/${id}`, {}, { id, Incoming_DateTime, FIO, Rental_Time, game_place });
    if (res) {
        return res;
    } else {
        return "Не получилось отредактировать";
    }
};

export const addBooking = async (Incoming_DateTime: string, FIO: string, Rental_Time: string, game_place: string) => {
    const res = await postRequest(`/api/booking/add`, {}, { Incoming_DateTime, FIO, Rental_Time, game_place });
    if (res) {
        const res2 = await getBooking()
        return res2;
    } else {
        return "Не получилось добавить новое бронирование";
    }
};
