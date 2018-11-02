/*
import { init } from '../lib/statistics';
import app from '../server';

const statistics = app.get('statistics');

const initStatisticsTasks = cronTime => statistics.cities.forEach(city => {
  const taskInfo = {
    taskName: statistics.taskName,
    // cronTime,
    city: city.name,
  };
  init(taskInfo);
});

initStatisticsTasks(statistics.cronTime);
*/
