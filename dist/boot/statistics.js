'use strict';

var _statistics = require('../lib/statistics');

var _server = require('../server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const statistics = _server2.default.get('statistics');

async function initStatisticsTasks() {
  statistics.cities.forEach(async city => {
    for (let i = 0; i < 100000; i++) {
      await (0, _statistics.run)({
        taskName: statistics.taskName,
        city,
        currentDate: new Date(2017, 11, 20) // 25-12-2017 december,
      });
    }
  });
}

initStatisticsTasks();