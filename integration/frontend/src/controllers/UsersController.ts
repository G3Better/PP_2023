import { deleteRequest, getRequest, putRequest } from "../axios/http";

export const getUsers = async () => {
    const data = await getRequest("/api/users");
    if (data) {
        const id = localStorage.getItem("id");
        const res = data.filter((el: any) => el.id !== Number(id));
        return res;
    } else {
        return "Данных нет";
    }
};

export const getRoles = async () => {
    const data = await getRequest("/api/roles");
    if (data) {
        const res = data.map((el: any) => ({ id: el.id, name: el.role }))
        return res;
    } else {
        return "Данных нет";
    }
};

export const deleteUser = async (id: string) => {
    const data = await deleteRequest(`/api/users/delete/${id}`, {}, { id });
    if (data) {
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editUser = async (id: string, fio: string, email: string, post: string, contacts: string, idRole: number, ) => {
    const data = await putRequest(`/api/users/edit/${id}`, {}, { id, fio, email, post, contacts, idRole });
    if (data) {
        return data;
    } else {
        return "Не получилось отредактировать";
    }
};
