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

const csv = (columns, data) => {
  stringify([
    columns,
    ...data,
  ], (err, output) => {
    const fileName = `AO${data[0][0]}${data[0][1]}${data[0][2]}${data[0][4]}.csv`;
    const file = resolve(process.env.STATISTICS_OUTPUT_DIR, fileName);
    writeFile(file, output, err => {
      if (err) throw err;
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

/*
{"order":"date","where":{"and":[{"date":{"between":["2017-12-29T00:30:00.000Z","2017-12-31T00:30:00.000Z"]}},{"totalMinutes":{"gt":0}}]}}
5268

 */
const getTransaction = (info, startDate, endDate) => new Promise((success, reject) => app.models.Transaction.find({
  order: 'date',
  where: {
    and: [
      {
        date: {
          between: [moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss')],
        },
      },
      {
        totalMinutes: {
          gt: 0,
        },
      },
    ],
  },
}, (err, data) => {
  if (err) {
    reject(err);
  } else {
    console.log('Transactions:', moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss'), data.length);
    success(data);
  }
}));

const getZone = zone => (zone ? zone.code : 'zona sin definir');

const calculateArray = (transactions, currentDate, window, size) => {
  const data = [];
  for (let tt = 0; tt < window; tt++) {
    const startDate = addMinutes(currentDate, size * tt);
    const endDate = addMinutes(startDate, size);
    data.push({
      base_currentDate: moment(currentDate),
      base_zone_count: transactions.length,
      tt: tt + 1,
      startDate: moment(startDate),
      endDate: moment(endDate),
      start: transactions.reduce((accumulator, { bookingStartDate }) => {
        accumulator += isWithinRange(moment(bookingStartDate), moment(startDate), moment(endDate));
        return accumulator;
      }, 0),
      end: transactions.reduce((accumulator, { bookingEndDate }) => {
        accumulator += isWithinRange(moment(bookingEndDate), moment(startDate), moment(endDate));
        return accumulator;
      }, 0),
    });
  }
  return data;
};

const getStatistic = (info, values, date, zone, window = 96, size = 30) => {
  const values_with_zone = values.map(transaction => ({
    ...transaction.toObject(),
    zone: getZone(zone.find(z => z.parkingMeter.map(Number).includes(transaction.parkingMeter_id))),
  }));

  const values_by_zone = groupBy(values_with_zone, 'zone');

  let fileName = `T${info[0]}${info[1]}${info[2]}${info[4]}.json`;
  let file = resolve(process.env.TRANSACTIONS_OUTPUT_DIR, fileName);
  writeFile(file, JSON.stringify(values_by_zone, null, 4), err => {
    if (err) throw err;
  });

  const result = objectMap(values_by_zone, transactions => calculateArray(transactions, date, window, size));

  fileName = `T${info[0]}${info[1]}${info[2]}${info[4]}_result.json`;
  file = resolve(process.env.TRANSACTIONS_BY_ZONE_OUTPUT_DIR, fileName);
  writeFile(file, JSON.stringify(result, null, 4), err => {
    if (err) throw err;
  });

  return result;
};

const getStatistic2 = (info, values, date, zone, window, size) => objectMap(groupBy(values.map(transaction => ({
  ...transaction.toObject(),
  zone: getZone(zone.find(z => z.parkingMeter.map(Number).includes(transaction.parkingMeter_id))),
})), 'zone'), transactions => {
  const data = [];
  for (let tt = 0; tt < window; tt++) {
    const startDate = addMinutes(date, size * tt);
    const endDate = addMinutes(startDate, size);
    data.push({
      tt: tt + 1,
      startDate,
      endDate,
      transactions,
      transactions_count: transactions.length,
      transactions_start: transactions.reduce((accumulator, t) => {
        if (isWithinRange(t.bookingStartDate, startDate, endDate)) {
          accumulator.push(t);
        }
        return accumulator;
      }, []),
      start: transactions.reduce((accumulator, { bookingStartDate }) => {
        accumulator += isWithinRange(bookingStartDate, startDate, endDate);
        return accumulator;
      }, 0),
      transactions_end: transactions.reduce((accumulator, t) => {
        if (isWithinRange(t.bookingEndDate, startDate, endDate)) {
          accumulator.push(t);
        }
        return accumulator;
      }, []),
      end: transactions.reduce((accumulator, { bookingEndDate }) => {
        accumulator += isWithinRange(bookingEndDate, startDate, endDate);
        return accumulator;
      }, 0),
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
  let tt = Math.ceil(((getHours(currentDate) * 60) + getMinutes(currentDate)) / 30);
  if (tt === 0) {
    tt = 48;
    printableDate = subDays(currentDate, 1);
  }

  console.log('Generating statistics', taskName, name, moment(printableDate).format('YYYY-MM-DD HH:mm'), tt);
  try {
    const commonData = [];
    const columns = [];

    columns.push('aaaa');
    commonData.push(getYear(printableDate));

    columns.push('mm');
    commonData.push(addLeadingZeros(getMonth(printableDate) + 1, 2));

    columns.push('dd');
    commonData.push(addLeadingZeros(getDate(printableDate), 2));

    columns.push('ds');
    commonData.push(addLeadingZeros(getDay(printableDate) || 7, 2));

    columns.push('tt');
    commonData.push(addLeadingZeros(tt, 2));

    const transactions = getStatistic(commonData, await getTransaction(commonData, subDays(currentDate, 2), currentDate), subDays(currentDate, 2), zone, 96, 30);

    columns.push('Z');

    for (let o = 1; o <= 96; o++) {
      columns.push(`O${o}`);
    }

    const data = Object.keys(transactions).sort().reduce((result, zone) => {
      result.push([
        ...commonData,
        zone,
        ...transactions[zone].map(({ start, end }) => start - end),
      ]);
      return result;
    }, []);

    csv(columns, data);
    update(taskInfo);
  } catch (error) {
    console.log(error);
  }
};

export const init = async taskInfo => {
  if (!existsSync(process.env.STATISTICS_OUTPUT_DIR)) {
    mkdirSync(process.env.STATISTICS_OUTPUT_DIR);
  }
  if (!existsSync(process.env.TRANSACTIONS_OUTPUT_DIR)) {
    mkdirSync(process.env.TRANSACTIONS_OUTPUT_DIR);
  }
  if (!existsSync(process.env.TRANSACTIONS_BY_ZONE_OUTPUT_DIR)) {
    mkdirSync(process.env.TRANSACTIONS_BY_ZONE_OUTPUT_DIR);
  }
  const {
    cronTime,
  } = taskInfo;
  if (cronTime) {
    cron.schedule(cronTime, () => run(taskInfo), true);
  } else {
    return run(taskInfo);
  }
};
