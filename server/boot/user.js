module.exports = function (app) {
  var User = app.models.User;

  User.disableRemoteMethod('patchAttributes');
  User.disableRemoteMethodByName('patchOrCreate');
  //User.disableRemoteMethodByName('create');
  User.disableRemoteMethodByName('exists');
  User.disableRemoteMethodByName('findById');
  User.disableRemoteMethodByName('deleteById');
  User.disableRemoteMethodByName('count');
  User.disableRemoteMethodByName('find');
  User.disableRemoteMethodByName('findOne');
  User.disableRemoteMethodByName('createChangeStream');
  User.disableRemoteMethodByName('updateAll');
  User.disableRemoteMethodByName('replaceById');
  User.disableRemoteMethodByName('replaceOrCreate');
  User.disableRemoteMethodByName('upsertWithWhere');

  //User.disableRemoteMethod("create", true);
  User.disableRemoteMethod("upsert", true);
  User.disableRemoteMethod("updateAll", true);
  User.disableRemoteMethod("updateAttributes", false);

  User.disableRemoteMethod("find", true);
  User.disableRemoteMethod("findById", true);
  User.disableRemoteMethod("findOne", true);

  User.disableRemoteMethod("deleteById", true);

  User.disableRemoteMethod("confirm", true);
  User.disableRemoteMethod("count", true);
  User.disableRemoteMethod("exists", true);
  User.disableRemoteMethod("resetPassword", true);

  User.disableRemoteMethod('__count__accessTokens', false);
  User.disableRemoteMethod('__create__accessTokens', false);
  User.disableRemoteMethod('__delete__accessTokens', false);
  User.disableRemoteMethod('__destroyById__accessTokens', false);
  User.disableRemoteMethod('__findById__accessTokens', false);
  User.disableRemoteMethod('__get__accessTokens', false);
  User.disableRemoteMethod('__updateById__accessTokens', false);

  User.observe('after save', function function_name(ctx, next) {
    if (ctx.instance) {
      if (ctx.isNewInstance) {
        // look up role based on type
        Role.find({where: {name: 'admin'}}, function (err, role) {
          if (err) {
            return console.log(err);
          }
          RoleMapping.create({
            principalType: "USER",
            principalId: ctx.instance.id,
            roleId: role.id
          }, function (err, roleMapping) {
            if (err) {
              return console.log(err);
            }
            console.log('User assigned RoleID ' + role.id + ' (' + ctx.instance.type + ')');
          });
        });
      }
    }
    next();
  });
}
