'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _csvStringify = require('csv-stringify');

var _csvStringify2 = _interopRequireDefault(_csvStringify);

var _fs = require('fs');

var _path = require('path');

var _dateFns = require('date-fns');

var _utils = require('./utils');

var _utils2 = require('../../commons/utils');

var _server = require('../../server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const csv = (columns, data) => {
  (0, _csvStringify2.default)([columns, ...data], (err, output) => {
    const fileName = `AO${data[0][0]}${data[0][1]}${data[0][2]}${data[0][4]}.csv`;
    const file = (0, _path.resolve)(process.env.STATISTICS_OUTPUT_DIR, fileName);
    (0, _fs.writeFile)(file, output, err => {
      if (err) throw err;
    });
  });
};

const update = taskInfo => {
  const { taskName, city } = taskInfo;
  _server2.default.models.TaskInfo.upsertWithWhere({
    taskName,
    city
  }, { taskName, city, lastUpdate: (0, _moment2.default)(new Date()).utcOffset('+0200').format('YYYY-MM-DD HH:mm:ss') }, err => {
    if (err) throw err;
  });
};

/*
{"order":"date","where":{"and":[{"date":{"between":["2017-12-29T00:30:00.000Z","2017-12-31T00:30:00.000Z"]}},{"totalMinutes":{"gt":0}}]}}
5268

 */
const getTransaction = (info, startDate, endDate) => new Promise((success, reject) => _server2.default.models.Transaction.find({
  order: 'date',
  where: {
    and: [{
      date: {
        between: [(0, _moment2.default)(startDate).format('YYYY-MM-DD HH:mm:ss'), (0, _moment2.default)(endDate).format('YYYY-MM-DD HH:mm:ss')]
      }
    }, {
      totalMinutes: {
        gt: 0
      }
    }]
  }
}, (err, data) => {
  if (err) {
    reject(err);
  } else {
    console.log('Transactions:', (0, _moment2.default)(startDate).format('YYYY-MM-DD HH:mm:ss'), (0, _moment2.default)(endDate).format('YYYY-MM-DD HH:mm:ss'), data.length);
    success(data);
  }
}));

const getZone = zone => zone ? zone.code : 'zona sin definir';

const calculateArray = (transactions, currentDate, window, size) => {
  const data = [];
  for (let tt = 0; tt < window; tt++) {
    const startDate = (0, _dateFns.addMinutes)(currentDate, size * tt);
    const endDate = (0, _dateFns.addMinutes)(startDate, size);
    data.push({
      base_currentDate: (0, _moment2.default)(currentDate),
      base_zone_count: transactions.length,
      tt: tt + 1,
      startDate: (0, _moment2.default)(startDate),
      endDate: (0, _moment2.default)(endDate),
      start: transactions.reduce((accumulator, { bookingStartDate }) => {
        accumulator += (0, _dateFns.isWithinRange)((0, _moment2.default)(bookingStartDate), (0, _moment2.default)(startDate), (0, _moment2.default)(endDate));
        return accumulator;
      }, 0),
      end: transactions.reduce((accumulator, { bookingEndDate }) => {
        accumulator += (0, _dateFns.isWithinRange)((0, _moment2.default)(bookingEndDate), (0, _moment2.default)(startDate), (0, _moment2.default)(endDate));
        return accumulator;
      }, 0)
    });
  }
  return data;
};

const getStatistic = (info, values, date, zone, window = 96, size = 30) => {
  const values_with_zone = values.map(transaction => _extends({}, transaction.toObject(), {
    zone: getZone(zone.find(z => z.parkingMeter.map(Number).includes(transaction.parkingMeter_id)))
  }));

  const values_by_zone = (0, _utils2.groupBy)(values_with_zone, 'zone');

  let fileName = `T${info[0]}${info[1]}${info[2]}${info[4]}.json`;
  let file = (0, _path.resolve)(process.env.TRANSACTIONS_OUTPUT_DIR, fileName);
  (0, _fs.writeFile)(file, JSON.stringify(values_by_zone, null, 4), err => {
    if (err) throw err;
  });

  const result = (0, _utils2.objectMap)(values_by_zone, transactions => calculateArray(transactions, date, window, size));

  fileName = `T${info[0]}${info[1]}${info[2]}${info[4]}_result.json`;
  file = (0, _path.resolve)(process.env.TRANSACTIONS_BY_ZONE_OUTPUT_DIR, fileName);
  (0, _fs.writeFile)(file, JSON.stringify(result, null, 4), err => {
    if (err) throw err;
  });

  return result;
};

const getStatistic2 = (info, values, date, zone, window, size) => (0, _utils2.objectMap)((0, _utils2.groupBy)(values.map(transaction => _extends({}, transaction.toObject(), {
  zone: getZone(zone.find(z => z.parkingMeter.map(Number).includes(transaction.parkingMeter_id)))
})), 'zone'), transactions => {
  const data = [];
  for (let tt = 0; tt < window; tt++) {
    const startDate = (0, _dateFns.addMinutes)(date, size * tt);
    const endDate = (0, _dateFns.addMinutes)(startDate, size);
    data.push({
      tt: tt + 1,
      startDate,
      endDate,
      transactions,
      transactions_count: transactions.length,
      transactions_start: transactions.reduce((accumulator, t) => {
        if ((0, _dateFns.isWithinRange)(t.bookingStartDate, startDate, endDate)) {
          accumulator.push(t);
        }
        return accumulator;
      }, []),
      start: transactions.reduce((accumulator, { bookingStartDate }) => {
        accumulator += (0, _dateFns.isWithinRange)(bookingStartDate, startDate, endDate);
        return accumulator;
      }, 0),
      transactions_end: transactions.reduce((accumulator, t) => {
        if ((0, _dateFns.isWithinRange)(t.bookingEndDate, startDate, endDate)) {
          accumulator.push(t);
        }
        return accumulator;
      }, []),
      end: transactions.reduce((accumulator, { bookingEndDate }) => {
        accumulator += (0, _dateFns.isWithinRange)(bookingEndDate, startDate, endDate);
        return accumulator;
      }, 0)
    });
  }
  return data;
});

const run = async taskInfo => {
  const { taskName, city: { name, zone }, currentDate } = taskInfo;

  // cron task runs each 25,55 minutes
  // 00:00 to 00:30 tt=1 -> 00:25 => 0.83 tt=1
  // 00:30 to 01:00 tt=2 -> 00:55 => 1.83 tt=2
  // ...
  // 23:30 to 24:00 tt=48 -> 23:55 => 47.83 tt=48
  let printableDate = currentDate;
  let tt = Math.ceil(((0, _dateFns.getHours)(currentDate) * 60 + (0, _dateFns.getMinutes)(currentDate)) / 30);
  if (tt === 0) {
    tt = 48;
    printableDate = (0, _dateFns.subDays)(currentDate, 1);
  }

  console.log('Generating statistics', taskName, name, (0, _moment2.default)(printableDate).format('YYYY-MM-DD HH:mm'), tt);
  try {
    const commonData = [];
    const columns = [];

    columns.push('aaaa');
    commonData.push((0, _dateFns.getYear)(printableDate));

    columns.push('mm');
    commonData.push((0, _utils.addLeadingZeros)((0, _dateFns.getMonth)(printableDate) + 1, 2));

    columns.push('dd');
    commonData.push((0, _utils.addLeadingZeros)((0, _dateFns.getDate)(printableDate), 2));

    columns.push('ds');
    commonData.push((0, _utils.addLeadingZeros)((0, _dateFns.getDay)(printableDate) || 7, 2));

    columns.push('tt');
    commonData.push((0, _utils.addLeadingZeros)(tt, 2));

    const transactions = getStatistic(commonData, (await getTransaction(commonData, (0, _dateFns.subDays)(currentDate, 2), currentDate)), (0, _dateFns.subDays)(currentDate, 2), zone, 96, 30);

    columns.push('Z');

    for (let o = 1; o <= 96; o++) {
      columns.push(`O${o}`);
    }

    const data = Object.keys(transactions).sort().reduce((result, zone) => {
      result.push([...commonData, zone, ...transactions[zone].map(({ start, end }) => start - end)]);
      return result;
    }, []);

    csv(columns, data);
    update(taskInfo);
  } catch (error) {
    console.log(error);
  }
};

const init = exports.init = async taskInfo => {
  if (!(0, _fs.existsSync)(process.env.STATISTICS_OUTPUT_DIR)) {
    (0, _fs.mkdirSync)(process.env.STATISTICS_OUTPUT_DIR);
  }
  if (!(0, _fs.existsSync)(process.env.TRANSACTIONS_OUTPUT_DIR)) {
    (0, _fs.mkdirSync)(process.env.TRANSACTIONS_OUTPUT_DIR);
  }
  if (!(0, _fs.existsSync)(process.env.TRANSACTIONS_BY_ZONE_OUTPUT_DIR)) {
    (0, _fs.mkdirSync)(process.env.TRANSACTIONS_BY_ZONE_OUTPUT_DIR);
  }
  const {
    cronTime
  } = taskInfo;
  if (cronTime) {
    _nodeCron2.default.schedule(cronTime, () => run(taskInfo), true);
  } else {
    return run(taskInfo);
  }
};