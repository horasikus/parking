'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseline = exports.objectMap = exports.groupBy = exports.getZone = exports.formatDate = exports.addLeadingZeros = exports.isHoliday = exports.getHolidays = undefined;

var _dateFns = require('date-fns');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _server = require('../../server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const holidayFormat = 'DD/MM/YYYY';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const getHolidays = exports.getHolidays = city => _server2.default.get('holidays').cities[city].map(date => (0, _dateFns.format)((0, _dateFns.parse)(date), holidayFormat));

const isHoliday = exports.isHoliday = (date, holidays) => (0, _dateFns.isSunday)(date) || holidays.includes((0, _dateFns.format)(date, holidayFormat));

const addLeadingZeros = exports.addLeadingZeros = (str, n) => `0000${str}`.slice(-n);

const formatDate = exports.formatDate = date => (0, _moment2.default)(date).format(DATE_FORMAT);

const getZone = exports.getZone = zone => zone ? zone.code : 'zona sin definir';

const groupBy = exports.groupBy = (xs, key) => xs.reduce((rv, x) => {
  (rv[x[key]] = rv[x[key]] || []).push(x);
  return rv;
}, {});

const objectMap = exports.objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(object[key], key);
  return result;
}, {});

const getBaseline = exports.getBaseline = (values, window) => values.reduce((rv, x) => {
  rv[x] = Array(window).fill({ a: 0, d: 0 });
  return rv;
}, {});