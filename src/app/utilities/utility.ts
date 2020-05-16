export const convertYYYYMMDD = (date) => {
    const dateInput = new Date(date);
    const y = dateInput.getFullYear();
    const m = dateInput.getMonth() + 1;
    const d = dateInput.getDate();
    const mm = m < 10 ? '0' + m : m;
    const dd = d < 10 ? '0' + d : d;
    return '' + y + mm + dd;
}

export const getDateTitle = (date) => {
    const dateStr = convertYYYYMMDD(date);
    const todayStr = convertYYYYMMDD(new Date());
    const yesterdayStr = convertYYYYMMDD(new Date().setDate(new Date().getDate() -1));
    const tomorrow = convertYYYYMMDD(new Date().setDate(new Date().getDate() +1));
    switch(dateStr) {
        case todayStr : { return 'Today' }
        case yesterdayStr: { return 'Yesterday' }
        case tomorrow: { return 'Tomorrow' }
        default: { return new Date(date).toLocaleDateString() }
    }
}