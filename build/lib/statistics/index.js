'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

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

var _transactions = require('../../../test/transactions.json');

var _transactions2 = _interopRequireDefault(_transactions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_OPTIONS = {
  output: 'statistics'
};

/*
const dummy = [];
const now = new Date();
const date = subDays(now, 2);
const rate = ['blue',
  'green resident',
  'green non-resident',
  'other'];
for (let i = 0; i < 96; i++) {
  dummy.push({
    id: i,
    bookingStartDate: addMinutes(date, 15 * i),
    bookingEndDate: addHours(addMinutes(date, 15 * i), 1),
    rate: rate[Math.floor(Math.random() * rate.length)],
  });
}
const json = JSON.stringify(dummy);
fs.writeFile('test/transactions.json', json, 'utf8');
*/

const csv = (columns, data) => {
  (0, _csvStringify2.default)([columns, data], (err, output) => {
    const fileName = `AO${data[0][0]}${data[0][1]}${data[0][2]}${data[0][4]}.csv`;
    const file = (0, _path.resolve)(DEFAULT_OPTIONS.output, fileName);
    (0, _fs.writeFile)(file, output, err => {
      if (err) throw err;
      /*
      console.log(`uploading file: ${fileName}`);
      uploader.upload(file, result => {
        if (result.error) {
          throw result.error;
        }
        console.log(result);
      }, {
        resource_type: 'raw',
        folder: 'statistics',
        public_id: fileName,
      });
      */
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

const getTransaction = (startDate, endDate) => new Promise((resolve, reject) => _server2.default.models.Transaction.find({
  order: 'date',
  where: {
    date: {
      between: [startDate, endDate]
    }
  }
}, (err, data) => {
  if (err) {
    reject(err);
  } else {
    console.log('Transaction:', (0, _moment2.default)(startDate).utcOffset('+0200').format('YYYY-MM-DD HH:mm:ss'), (0, _moment2.default)(endDate).utcOffset('+0200').format('YYYY-MM-DD HH:mm:ss'), data.length);
    // resolve(data);
    resolve(_transactions2.default);
  }
}));

const getStatistic = (values, date, window, size) => {
  const result = (0, _utils2.objectMap)((0, _utils2.groupBy)(values, 'rate'), transactions => {
    const data = [];
    for (let tt = 0; tt < window; tt++) {
      const startDate = (0, _dateFns.addMinutes)(date, size * tt);
      const endDate = (0, _dateFns.addMinutes)(startDate, size);
      data.push({
        tt: tt + 1,
        startDate,
        endDate,
        inside: transactions.reduce((accumulator, { bookingStartDate }) => {
          accumulator += (0, _dateFns.isWithinRange)(bookingStartDate, startDate, endDate);
          return accumulator;
        }, 0),
        outside: transactions.reduce((accumulator, { bookingEndDate }) => {
          accumulator += (0, _dateFns.isWithinRange)(bookingEndDate, startDate, endDate);
          return accumulator;
        }, 0)
      });
    }
    return data;
  });
  return result;
};

const run = async taskInfo => {
  const { taskName, city } = taskInfo;

  const currentDate = new Date();
  // cron task runs each 25,55 minutes
  // 00:00 to 00:30 tt=1 -> 00:25 => 0.83 tt=1
  // 00:30 to 01:00 tt=2 -> 00:55 => 1.83 tt=2
  // ...
  // 23:30 to 24:00 tt=48 -> 23:55 => 47.83 tt=48
  const tt = Math.ceil(((0, _dateFns.getHours)(currentDate) * 60 + (0, _dateFns.getMinutes)(currentDate)) / 30);

  console.log('Generating statistics', taskName, city, (0, _moment2.default)(new Date()).utcOffset('+0200').format('YYYY-MM-DD HH:mm:ss'), tt);
  try {
    const transactions = getStatistic((await getTransaction((0, _dateFns.subDays)(currentDate, 2), currentDate)), (0, _dateFns.subDays)(currentDate, 2), 96, 30);

    const commonData = [];
    const columns = [];

    columns.push('aaaa');
    commonData.push((0, _dateFns.getYear)(currentDate));

    columns.push('mm');
    commonData.push((0, _utils.addLeadingZeros)((0, _dateFns.getMonth)(currentDate), 2));

    columns.push('dd');
    commonData.push((0, _utils.addLeadingZeros)((0, _dateFns.getDate)(currentDate), 2));

    columns.push('ds');
    commonData.push((0, _utils.addLeadingZeros)((0, _dateFns.getDay)(currentDate), 2));

    columns.push('tt');
    commonData.push((0, _utils.addLeadingZeros)(tt, 2));

    columns.push('Z');

    for (let o = 1; o <= 96; o++) {
      columns.push(`O${o}`);
    }

    const data = Object.keys(transactions).reduce((result, rate) => {
      result.push([...commonData, rate, ...transactions[rate].map(({ inside, outside }) => inside - outside)]);
      return result;
    }, []);

    csv(columns, data);
    update(taskInfo);
  } catch (error) {
    console.log(error);
  }
};

const init = exports.init = taskInfo => {
  if (!(0, _fs.existsSync)(DEFAULT_OPTIONS.output)) {
    (0, _fs.mkdirSync)(DEFAULT_OPTIONS.output);
  }
  const { taskName, city, cronTime } = taskInfo;
  console.log(cronTime ? 'Scheduling task' : 'Running task', taskName, city, cronTime);
  if (cronTime) {
    _nodeCron2.default.schedule(cronTime, () => run(taskInfo), true);
  } else {
    run(taskInfo);
  }
};