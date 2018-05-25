module.exports = function (app) {
  var User = app.models.User;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  User.create([
    {username: 'miquel.montaner', email: 'miquel@cumlaude.tech', password: 'm1qu3l'},
    {username: 'horacio.lagandara', email: 'hglagan@gmail.com', password: 'm1st3r10'},
    {username: 'eymbert.fisersa', email: 'eymbert.fisersa@gmail.com', password: 'f1s3rs@'}
  ], function (err, users) {
    if (err) throw err;

    console.log('Created users:', users);

    //create the admin role
    Role.create({
      name: 'admin'
    }, function (err, role) {
      if (err) throw err;

      console.log('Created role:', role);

      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function (err, principal) {
        if (err) throw err;
        console.log('Created principal:', principal);
      });

      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[1].id
      }, function (err, principal) {
        if (err) throw err;
        console.log('Created principal:', principal);
      });

      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[2].id
      }, function (err, principal) {
        if (err) throw err;
        console.log('Created principal:', principal);
      });
    });
  });
}
