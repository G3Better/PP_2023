import { postRequest } from "../axios/http"

export const signIn = async (login: string, password: string) => {
    const data = await postRequest(`/api/signIn/${login}`, {}, { login, password });
    if (data) {
        return data
    } else {
        return 'Логин или пароль введены не правильно'
    }
}
export const signUp = async (fio: string, login: string, password: string) => {
    const data = await postRequest(`/api/signUp/${login}`, {}, { fio, login, password });
    if (data) {
        return data
    } else {
        return 'Такой логин уже кем-то занят'
    }
}
