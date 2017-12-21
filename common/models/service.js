'use strict';
var aws = require('aws-sdk');
var AWS_ACCESS_KEY = 'AKIAJQJ4KTHGYIB'
var AWS_SECRET_KEY = '38LpQRHf4uTiE00kc2coD8Kr+YP2/uylhNy'
var S3_BUCKET = 'sdfsf'
module.exports = function(Service) {
  Service.getServiceById = function(id,cb){
    console.log(id);
    //cb(null,id)
    var filter = {
      include: ['vertical', 'serviceZones']
    };
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


    Service.uploadFile = function(serviceData,cb){
      //console.log(serviceData.name);
      serviceData.name = Math.floor((Math.random() * 100000000) + 1)+'_'+serviceData.name;
      aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});

      var s3 = new aws.S3()
      var options = {
        Bucket: S3_BUCKET,
        Key: serviceData.name,
        Expires: 60,
        ContentType: serviceData.type,
        ACL: 'public-read'
      }
      return s3.getSignedUrl('putObject', options, function(err, data){
        console.log(err);
        if(err) {
          cb()
        }else{
          var resData = {
            signed_request: data,
            url: 'https://s3-eu-west-1.amazonaws.com/' + S3_BUCKET + '/' + serviceData.name
          }
          console.log(resData);
          cb(null, resData);
          //cb(resData);
        }

    })
      // Service.upsert( serviceData, function (err, res) {
      //     cb(null, res);
      // });
    }
    Service.remoteMethod('uploadFile', {
          http: {path: '/uploadFile', verb: 'post'},
           accepts:{
              arg: 'serviceData',
              type: 'object',
              http:{source:'body'}
            },
          returns: {arg: 'service', type: 'object'}
    });
};
