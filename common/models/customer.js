'use strict';

module.exports = function(Customer) {
  //Customer.disableRemoteMethod('patchAttributes');
  Customer.disableRemoteMethodByName('patchOrCreate');
  //Customer.disableRemoteMethodByName('create');
  Customer.disableRemoteMethodByName('exists');
  //Customer.disableRemoteMethodByName('findById');
  //Customer.disableRemoteMethodByName('deleteById');
  //Customer.disableRemoteMethodByName('count');
  //Customer.disableRemoteMethodByName('find');
  Customer.disableRemoteMethodByName('findOne');
  Customer.disableRemoteMethodByName('createChangeStream');
  Customer.disableRemoteMethodByName('updateAll');
  Customer.disableRemoteMethodByName('replaceById');
  Customer.disableRemoteMethodByName('replaceOrCreate');
  Customer.disableRemoteMethodByName('upsertWithWhere');
};
