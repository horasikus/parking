const s = require('shelljs');

s.rm('-rf', 'dist');
s.mkdir('dist');
s.mkdir('dist/models');
s.cp('-R', './src/explorer', 'dist/explorer');
s.cp('./src/*.json', 'dist');
s.cp('./src/models/*.json', 'dist/models');
