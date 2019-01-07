import { isSunday, format, parse } from 'date-fns';
import moment from 'moment';
import app from '../../server';

const holidayFormat = 'DD/MM/YYYY';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const getHolidays = city => app.get('holidays').cities[city].map(date => format(parse(date), holidayFormat));

export const isHoliday = (date, holidays) => isSunday(date) || holidays.includes(format(date, holidayFormat));

export const addLeadingZeros = (str, n) => (`0000${str}`).slice(-n);

export const formatDate = date => moment(date).format(DATE_FORMAT);

export const getZone = zone => (zone ? zone.code : 'zona sin definir');

export const groupBy = (xs, key) => xs.reduce((rv, x) => {
  (rv[x[key]] = rv[x[key]] || []).push(x);
  return rv;
}, {});

export const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(object[key], key);
  return result;
}, {});

export const getBaseline = (values, window) => values.reduce((rv, x) => {
  rv[x] = Array(window).fill({ a: 0, d: 0 });
  return rv;
}, {});
