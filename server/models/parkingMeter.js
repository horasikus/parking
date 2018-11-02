module.exports = function (ParkingMeter) {
  // ParkingMeter.disableRemoteMethod('patchAttributes');
  ParkingMeter.disableRemoteMethodByName('patchOrCreate');
  // ParkingMeter.disableRemoteMethodByName('create');
  ParkingMeter.disableRemoteMethodByName('exists');
  // ParkingMeter.disableRemoteMethodByName('findById');
  // ParkingMeter.disableRemoteMethodByName('deleteById');
  // ParkingMeter.disableRemoteMethodByName('count');
  // ParkingMeter.disableRemoteMethodByName('find');
  ParkingMeter.disableRemoteMethodByName('findOne');
  ParkingMeter.disableRemoteMethodByName('createChangeStream');
  ParkingMeter.disableRemoteMethodByName('updateAll');
  ParkingMeter.disableRemoteMethodByName('replaceById');
  ParkingMeter.disableRemoteMethodByName('replaceOrCreate');
  ParkingMeter.disableRemoteMethodByName('upsertWithWhere');
  ParkingMeter.validatesUniquenessOf('id', { message: 'id must be unique' });
};
