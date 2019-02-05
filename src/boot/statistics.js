import { run } from '../lib/statistics';
import app from '../server';

const statistics = app.get('statistics');

async function initStatisticsTasks() {
  statistics.cities.forEach(async city => {
    for (let i = 0; i < 100000; i++) {
      await run({
        taskName: statistics.taskName,
        city,
        currentDate: new Date(2017, 11, 1), // 25-12-2017 december,
      });
    }
  });
}

initStatisticsTasks();
