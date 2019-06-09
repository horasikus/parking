import { init } from '../lib/statistics';
import app from '../server';

const statistics = app.get('statistics');

const initStatisticsTasks = cronTime => statistics.cities.forEach(async city => {
  const taskInfo = {
    taskName: statistics.taskName,
    cronTime,
    city: city.name,
    currentDate: new Date(), // 01-6-2019,
  };
  init(taskInfo);
});

initStatisticsTasks(statistics.cronTime);
