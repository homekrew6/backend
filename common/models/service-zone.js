'use strict';

module.exports = function(Servicezone) {

  Servicezone.getZoneRelatedService = function(zone,cb){
    console.log(zone);
    Servicezone.find({where: {zoneId: zone.id},include: ["service","zone"]}, function(err, res) {
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
