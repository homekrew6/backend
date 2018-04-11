'use strict';

module.exports = function(Servicezone) {
  Servicezone.getZoneRelatedService = function(zone,cb){
    Servicezone.find({where: {zoneId: zone.zone},include: ["service","zone"]}, function(err, res) {
        if(!err){
          cb(null,res);

        }else{
          cb(err);
        }
    });
  }
  Servicezone.remoteMethod('getZoneRelatedService', {
      http: {path: '/getZoneRelatedService', verb: 'post'},
       accepts: [
        {
          arg: 'zone',
          type: 'object',
          http:{source:'body'}
        }
      ],
        returns: {arg: 'response', type: 'object'}
    });
};
