'use strict';

module.exports = function (model) {
  model.disableRemoteMethod('patchAttributes');
  model.disableRemoteMethodByName('patchOrCreate');
  model.disableRemoteMethodByName('create');
  model.disableRemoteMethodByName('exists');
  model.disableRemoteMethodByName('findById');
  model.disableRemoteMethodByName('deleteById');
  // model.disableRemoteMethodByName('count');
  // model.disableRemoteMethodByName('find');
  model.disableRemoteMethodByName('findOne');
  model.disableRemoteMethodByName('createChangeStream');
  model.disableRemoteMethodByName('updateAll');
  model.disableRemoteMethodByName('replaceById');
  model.disableRemoteMethodByName('replaceOrCreate');
  model.disableRemoteMethodByName('upsertWithWhere');
};