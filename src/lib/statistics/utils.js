import { isSunday, format, parse } from 'date-fns';
import app from '../../server';

const holidayFormat = 'DD/MM/YYYY';

export const getHolidays = city => app.get('holidays').cities[city].map(date => format(parse(date), holidayFormat));

export const isHoliday = (date, holidays) => isSunday(date) || holidays.includes(format(date, holidayFormat));

export const addLeadingZeros = (str, n) => (`0000${str}`).slice(-n);
