'use strict';

module.exports = function(Zone) {
  Zone.getParentZone = function(cb){


    var filter = {
      where: {zoneId: 0}
    };

    return Zone.find(filter).then(function(empl) {

     return empl;
   }).catch(function(err) {
     console.log(err);
   });
  }
  Zone.remoteMethod('getParentZone', {
          http: {path: '/getParentZone', verb: 'get'},

            returns: {arg: 'zone', type: 'array'}
    });
};
