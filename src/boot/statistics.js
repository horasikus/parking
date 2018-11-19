import {
  addMinutes,
} from 'date-fns';
import { init } from '../lib/statistics';
import app from '../server';

const statistics = app.get('statistics');

const initStatisticsTasks = cronTime => statistics.cities.forEach(city => {
  const currentDate = new Date(2017, 11, 31); // 31-12-2017 december
  for (let i = 1; i <= 48; i++) {
    const taskInfo = {
      taskName: statistics.taskName,
      // cronTime,
      city,
      currentDate: addMinutes(currentDate, i * 30),
    };
    init(taskInfo);
  }
});

initStatisticsTasks(statistics.cronTime);
