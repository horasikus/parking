'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _fs = require('fs');

var _task = require('./task');

var _statistics = require('./statistics');

var _statistics2 = _interopRequireDefault(_statistics);

var _csv = require('./csv');

var _csv2 = _interopRequireDefault(_csv);

var _transaction = require('./transaction');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const run = async taskInfo => {
  try {
    if (!(0, _fs.existsSync)(process.env.STATISTICS_OUTPUT_DIR)) {
      (0, _fs.mkdirSync)(process.env.STATISTICS_OUTPUT_DIR);
    }
    const baseline = await (0, _task.find)(taskInfo);
    const statistics = new _statistics2.default(taskInfo, baseline);
    const transactions = await statistics.getTransactions();
    const txs = (0, _transaction.groupByZone)(transactions, taskInfo.city.zone);
    const results = statistics.generate(txs);
    const csv = new _csv2.default(statistics);
    csv.save(csv.generate(results));
    await (0, _task.update)(taskInfo, statistics, results);
  } catch (e) {
    console.log(e);
  }
};

const init = exports.init = taskInfo => {
  const { taskName, city, cronTime } = taskInfo;
  console.log(cronTime ? 'Scheduling task' : 'Running task', taskName, city, cronTime);
  if (cronTime) {
    _nodeCron2.default.schedule(cronTime, () => run(taskInfo), true);
  } else {
    run(taskInfo);
  }
};