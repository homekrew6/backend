'use strict';

module.exports = function(Service) {
  Service.getServiceById = function(id,cb){
    console.log(id);
    //cb(null,id)
    var filter = {
      include: ['vertical', 'serviceZones']
    };
    // Service.findById( id,filter, function (err, res) {
    //     cb(null, res);
    // });
    // Service.findById(id).then((err,res)=>{
    //
    //     cb(null, res);
    // });
    return Service.findById(id,filter).then(function(empl) {

     return empl;
   }).catch(function(err) {
     console.log(err);
   });
  }
  Service.remoteMethod('getServiceById', {
          http: {path: '/getServiceById/:id', verb: 'get'},
           accepts: [
            {arg: 'id', type: 'number',required:true}
          ],
            returns: {arg: 'service', type: 'object'}
    });
};
