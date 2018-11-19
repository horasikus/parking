'use strict';

var _dateFns = require('date-fns');

var _statistics = require('../lib/statistics');

var _server = require('../server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const statistics = _server2.default.get('statistics');

const initStatisticsTasks = cronTime => statistics.cities.forEach(city => {
  const currentDate = new Date(2017, 11, 31); // 31-12-2017 december
  for (let i = 1; i <= 48; i++) {
    const taskInfo = {
      taskName: statistics.taskName,
      // cronTime,
      city,
      currentDate: (0, _dateFns.addMinutes)(currentDate, i * 30)
    };
    (0, _statistics.init)(taskInfo);
  }
});

initStatisticsTasks(statistics.cronTime);