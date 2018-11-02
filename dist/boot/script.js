/*
module.exports = function (app) {
  var User = app.models.User;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  User.find({where: {email: 'parkeon@gmail.com'}}, function (err, users) {
    if (err) throw err;

    Role.find({where: {name: 'admin'}}, function (err, role) {
      if (err) throw err;

      RoleMapping.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id,
        roleId: role.id
      }, function (err, roleMapping) {
        if (err) {
          return console.log(err);
        }
      });
    })
  });
}
*/
"use strict";