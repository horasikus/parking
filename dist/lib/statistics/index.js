'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = undefined;

var _fs = require('fs');

var _task = require('./task');

var _statistics = require('./statistics');

var _statistics2 = _interopRequireDefault(_statistics);

var _csv = require('./csv');

var _csv2 = _interopRequireDefault(_csv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const run = exports.run = async taskInfo => {
  try {
    if (!(0, _fs.existsSync)(process.env.STATISTICS_OUTPUT_DIR)) {
      (0, _fs.mkdirSync)(process.env.STATISTICS_OUTPUT_DIR);
    }
    const baseline = await (0, _task.find)(taskInfo);
    const statistics = new _statistics2.default(taskInfo, baseline);
    const transactions = await statistics.getTransactions();
    const results = statistics.generate(transactions);
    const csv = new _csv2.default(statistics);
    csv.save(csv.generate(results));
    await (0, _task.update)(taskInfo, statistics, results);
  } catch (e) {
    console.log(e);
  }
};