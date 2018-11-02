const s = require('shelljs');

s.rm('-rf', 'build');
s.mkdir('build');
s.mkdir('build/models');
s.cp('-R', './server/explorer', 'build/explorer');
s.cp('./server/*.json', 'build');
s.cp('./server/models/*.json', 'build/models');
