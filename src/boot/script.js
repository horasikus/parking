module.exports = function (app) {
  const { User, Role } = app.models;

  Role.findOrCreate({
    name: 'admin',
  }, {
    name: 'admin',
  }, (err, instance, created) => {
    if (err) throw err;
    if (created) {
      console.log('Created role:', instance.name);
    }
  });

  User.findOrCreate({
    username: 'miquel.montaner',
  }, { username: 'miquel.montaner', email: 'miquel@cumlaude.tech', password: 'm1qu3l' }, (err, instance, created) => {
    if (err) throw err;
    if (created) {
      console.log('Created user:', instance.username);
    }
  });

  User.findOrCreate({
    username: 'eymbert.fisersa',
  }, { username: 'eymbert.fisersa', email: 'eymbert.fisersa@gmail.com', password: 'f1s3rs@' }, (err, instance, created) => {
    if (err) throw err;
    if (created) {
      console.log('Created user:', instance.username);
    }
  });

  User.findOrCreate({
    username: 'parkeon',
  }, { username: 'parkeon', email: 'parkeon@gmail.com', password: 'park30n' }, (err, instance, created) => {
    if (err) throw err;
    if (created) {
      console.log('Created user:', instance.username);
    }
  });
};
