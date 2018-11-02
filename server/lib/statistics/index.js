import cron from 'node-cron';
import moment from 'moment';
import stringify from 'csv-stringify';
import { writeFile, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import {
  getYear,
  getMonth,
  getDate,
  getDay,
  getHours,
  getMinutes,
  addMinutes,
  subDays,
  isWithinRange,
} from 'date-fns';
import { addLeadingZeros } from './utils';
import { groupBy, objectMap } from '../../commons/utils';
import app from '../../server';
import transactions from '../../../test/transactions.json';

const DEFAULT_OPTIONS = {
  output: 'statistics',
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
  stringify([
    columns,
    data,
  ], (err, output) => {
    const fileName = `AO${data[0][0]}${data[0][1]}${data[0][2]}${data[0][4]}.csv`;
    const file = resolve(DEFAULT_OPTIONS.output, fileName);
    writeFile(file, output, err => {
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
  app.models.TaskInfo.upsertWithWhere({
    taskName,
    city,
  }, { taskName, city, lastUpdate: moment(new Date()).utcOffset('+0200').format('YYYY-MM-DD HH:mm:ss') }, err => {
    if (err) throw err;
  });
};

const getTransaction = (startDate, endDate) => new Promise((resolve, reject) => app.models.Transaction.find({
  order: 'date',
  where: {
    date: {
      between: [startDate, endDate],
    },
  },
}, (err, data) => {
  if (err) {
    reject(err);
  } else {
    console.log('Transaction:', moment(startDate).utcOffset('+0200').format('YYYY-MM-DD HH:mm:ss'), moment(endDate).utcOffset('+0200').format('YYYY-MM-DD HH:mm:ss'), data.length);
    // resolve(data);
    resolve(transactions);
  }
}));

const getStatistic = (values, date, window, size) => {
  const result = objectMap(groupBy(values, 'rate'), transactions => {
    const data = [];
    for (let tt = 0; tt < window; tt++) {
      const startDate = addMinutes(date, size * tt);
      const endDate = addMinutes(startDate, size);
      data.push({
        tt: tt + 1,
        startDate,
        endDate,
        inside: transactions.reduce((accumulator, { bookingStartDate }) => {
          accumulator += isWithinRange(bookingStartDate, startDate, endDate);
          return accumulator;
        }, 0),
        outside: transactions.reduce((accumulator, { bookingEndDate }) => {
          accumulator += isWithinRange(bookingEndDate, startDate, endDate);
          return accumulator;
        }, 0),
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
  const tt = Math.ceil(((getHours(currentDate) * 60) + getMinutes(currentDate)) / 30);

  console.log('Generating statistics', taskName, city, moment(new Date()).utcOffset('+0200').format('YYYY-MM-DD HH:mm:ss'), tt);
  try {
    const transactions = getStatistic(await getTransaction(subDays(currentDate, 2), currentDate), subDays(currentDate, 2), 96, 30);

    const commonData = [];
    const columns = [];

    columns.push('aaaa');
    commonData.push(getYear(currentDate));

    columns.push('mm');
    commonData.push(addLeadingZeros(getMonth(currentDate), 2));

    columns.push('dd');
    commonData.push(addLeadingZeros(getDate(currentDate), 2));

    columns.push('ds');
    commonData.push(addLeadingZeros(getDay(currentDate), 2));

    columns.push('tt');
    commonData.push(addLeadingZeros(tt, 2));

    columns.push('Z');

    for (let o = 1; o <= 96; o++) {
      columns.push(`O${o}`);
    }

    const data = Object.keys(transactions).reduce((result, rate) => {
      result.push([
        ...commonData,
        rate,
        ...transactions[rate].map(({ inside, outside }) => inside - outside),
      ]);
      return result;
    }, []);

    csv(columns, data);
    update(taskInfo);
  } catch (error) {
    console.log(error);
  }
};

export const init = taskInfo => {
  if (!existsSync(DEFAULT_OPTIONS.output)) {
    mkdirSync(DEFAULT_OPTIONS.output);
  }
  const { taskName, city, cronTime } = taskInfo;
  console.log(cronTime ? 'Scheduling task' : 'Running task', taskName, city, cronTime);
  if (cronTime) {
    cron.schedule(cronTime, () => run(taskInfo), true);
  } else {
    run(taskInfo);
  }
};
