export const getInfoFromDate = (data: string) => {
    const date = new Date(data);
    const fullYear = date.getFullYear();
    const month = `0${date.getMonth()}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    return { fullYear, month, day, hours, minutes }
}

export const dateConverter = (data: string, type: "dateTime" | "date") => {
    const { fullYear, month, day, hours, minutes } = getInfoFromDate(data)
    if (type === 'dateTime') {
        return `${day}-${month}-${fullYear} ${hours}:${minutes}`;
    }
    return `${fullYear}-${month}-${day}`;
}

export const dateForModal = (data: string, type: "dateTime" | "date") => {
    const { fullYear, month, day, hours, minutes } = getInfoFromDate(data)
    if (type === 'dateTime') {
        return `${fullYear}-${month}-${day}T${hours}:${minutes}`;
    }
    return `${fullYear}-${month}-${day}`;
}

export const dateForAnswerToBackend = (data: string) => {
    const { fullYear, month, day, hours, minutes } = getInfoFromDate(data);
    return `${fullYear}-${month}-${day} ${hours}:${minutes}:00`;
}

export const convertDateToString = (data: Date | string) => {
    if (typeof data === 'string') {
        let [year, month, date] = data.split('-');
        month = `0${month}`.slice(-2);
        date = `0${date}`.slice(-2);
        return `${year}-${month}-${date}`;
    }
    const month = `0${data.getMonth()}`.slice(-2);
    const date = `0${data.getDate()}`.slice(-2);
    return `${data.getFullYear()}-${month}-${date}`
}