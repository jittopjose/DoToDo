import { DatePipe } from '@angular/common';

export const convertYYYYMMDD = (date) => {
    const dateInput = new Date(date);
    const y = dateInput.getFullYear();
    const m = dateInput.getMonth() + 1;
    const d = dateInput.getDate();
    const mm = m < 10 ? '0' + m : m;
    const dd = d < 10 ? '0' + d : d;
    return '' + y + mm + dd;
};

export const getDateTitle = (date: Date, datePipe: DatePipe) => {
    const dateStr = convertYYYYMMDD(date);
    const todayStr = convertYYYYMMDD(new Date());
    const yesterdayStr = convertYYYYMMDD(new Date().setDate(new Date().getDate() -1));
    const tomorrow = convertYYYYMMDD(new Date().setDate(new Date().getDate() +1));
    switch(dateStr) {
        case todayStr : { return 'Today (' + datePipe.transform(new Date(), 'EEE, MMM dd yyyy') + ')' }
        case yesterdayStr: { return 'Yesterday (' + datePipe.transform(new Date().setDate(new Date().getDate() -1), 'EEE, MMM dd yyyy') + ')' }
        case tomorrow: { return 'Tomorrow (' + datePipe.transform(new Date().setDate(new Date().getDate() +1), 'EEE, MMM dd yyyy') + ')'}
        default: { return datePipe.transform(new Date(date), 'EEE, MMM dd yyyy')}
    }
};

export const isWeekend = (date) => {
    const day = new Date(date).getDay();
    const isWeekend = (day === 6) || (day === 0);
    return isWeekend;
};