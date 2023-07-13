export const uniqArrayForModal = (data: any, currentData: any, field: string) => {
    const index = data?.findIndex(
        (el: { id: number; name: string }) => el.name === currentData[field]
    );
    const newObj = data.filter(
        (el: { id: number; name: string }) => el.name !== currentData[field]
    );
    newObj.unshift(data[index]);
    return Object.assign(currentData, { [`${field}Select`]: newObj });
}


export const checkIsArrayDataFromModal = (data: any) => {
    console.log(data);
    if (Array.isArray(data)) {
        return data?.[0]?.id;
    } else {
        return data.id;
    }

}