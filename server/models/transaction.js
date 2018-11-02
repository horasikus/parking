module.exports = function (Transaction) {
  // Transaction.disableRemoteMethod('patchAttributes');
  Transaction.disableRemoteMethodByName('patchOrCreate');
  // Transaction.disableRemoteMethodByName('create');
  Transaction.disableRemoteMethodByName('exists');
  // Transaction.disableRemoteMethodByName('findById');
  // Transaction.disableRemoteMethodByName('deleteById');
  // Transaction.disableRemoteMethodByName('count');
  // Transaction.disableRemoteMethodByName('find');
  Transaction.disableRemoteMethodByName('findOne');
  Transaction.disableRemoteMethodByName('createChangeStream');
  Transaction.disableRemoteMethodByName('updateAll');
  Transaction.disableRemoteMethodByName('replaceById');
  Transaction.disableRemoteMethodByName('replaceOrCreate');
  Transaction.disableRemoteMethodByName('upsertWithWhere');
};
