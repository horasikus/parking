'use strict';

var _statistics = require('../lib/statistics');

var _server = require('../server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const statistics = _server2.default.get('statistics');

const initStatisticsTasks = cronTime => statistics.cities.forEach(async city => {
  const taskInfo = {
    taskName: statistics.taskName,
    cronTime,
    city: city.name,
    currentDate: new Date() // 01-6-2019,
  };
  (0, _statistics.init)(taskInfo);
});

initStatisticsTasks(statistics.cronTime);