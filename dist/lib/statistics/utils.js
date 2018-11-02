'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addLeadingZeros = exports.isHoliday = exports.getHolidays = undefined;

var _dateFns = require('date-fns');

var _server = require('../../server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const holidayFormat = 'DD/MM/YYYY';

const getHolidays = exports.getHolidays = city => _server2.default.get('holidays').cities[city].map(date => (0, _dateFns.format)((0, _dateFns.parse)(date), holidayFormat));

const isHoliday = exports.isHoliday = (date, holidays) => (0, _dateFns.isSunday)(date) || holidays.includes((0, _dateFns.format)(date, holidayFormat));

const addLeadingZeros = exports.addLeadingZeros = (str, n) => `0000${str}`.slice(-n);