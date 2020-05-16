export const convertYYYYMMDD = (date) => {
    const dateInput = new Date(date);
    const y = dateInput.getFullYear();
    const m = dateInput.getMonth() + 1;
    const d = dateInput.getDate();
    const mm = m < 10 ? '0' + m : m;
    const dd = d < 10 ? '0' + d : d;
    return '' + y + mm + dd;
}