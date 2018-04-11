'use strict';
//var formidable = require('formidable');
var aws = require('aws-sdk');
const multiparty = require('multiparty');
//const { readFileSync } = require('fs');
const fs = require('fs');
const formidable = require('formidable');

const BUCKET = 'files.homekrew.com';
const BUCKETZONE = 'eu-central-1';
var AWS_ACCESS_KEY = 'AKIAJUKBBDPNW5ED2M2A'
var AWS_SECRET_KEY = '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'
var S3_BUCKET = 'files.homekrew.com'
const s3 = new aws.S3({
  AWS_ACCESS_KEY: 'AKIAJUKBBDPNW5ED2M2A',
  AWS_SECRET_KEY: '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',
  S3_BUCKET: 'files.homekrew.com'
});
module.exports = function (Service) {
  Service.getServiceById = function (id, cb) {
    //console.log(id);
    //cb(null,id)
    var filter = {
      include: ['vertical', 'serviceZones']
    };
    return Service.findById(id, filter).then(function (empl) {

      return empl;
    }).catch(function (err) {
      //console.log(err);
    });
  }
  Service.remoteMethod('getServiceById', {
    http: { path: '/getServiceById/:id', verb: 'get' },
    accepts: [
      { arg: 'id', type: 'number', required: true }
    ],
    returns: { arg: 'service', type: 'object' }
  });

  /**
  * Helper method which takes the request object and returns a promise with a file.
  */
  const getFileFromRequest = (req) => new Promise((resolve, reject) => {

  });

  /**
   * Helper method which takes the request object and returns a promise with the AWS S3 object details.
   */
  const uploadFileToS3 = (file, options = {}) => {

    // turn the file into a buffer for uploading
    const buffer = fs(file.path);

    // generate a new random file name
    const fileName = options.name || String(Date.now());

    // the extension of your file
    const extension = extname(file.path);

    // return a promise
    return new Promise((resolve, reject) => {
      return s3.upload({
        Bucket: 'mynicebucket',
        ACL: 'public-read',
        Key: join('example/file/path', `${fileName}${extension}`),
        Body: buffer,
      }, (err, result) => {
        if (err) reject(err);
        else resolve(result); // return the values of the successful AWS S3 request
      });
    });
  };

  Service.uploadFile = function (file, cb) {
    //console.log(file.headers);
    const form = new multiparty.Form();
    form.parse(file, (err, fields, files) => {
      if (err) reject(err);
      const fileToBeUploaded = files['file'][0]; // get the file from the returned files object
      //console.log(fileToBeUploaded);
    });

    cb(null, file);
    return false;
    const buffer = fs(file.path);


    const fileName = file.name || String(Date.now());


    const extension = extname(file.path);


    return new Promise((resolve, reject) => {
      return s3.upload({
        Bucket: 'files.homekrew.com',
        ACL: 'public-read',
        Key: join('/', `${fileName}${extension}`),
        Body: buffer,
      }, (err, result) => {
        if (err) {
          //console.log(err);
          reject(err);
        }
        else {
          //console.log(result);
          resolve(result); // return the values of the successful AWS S3 request
        }
      });
    });
    //console.log(serviceData.name);
    //   serviceData.name = Math.floor((Math.random() * 100000000) + 1)+'_'+serviceData.name;
    //   aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY,region:'us-west-2'});
    //
    //   var s3 = new aws.S3()
    //   var options = {
    //     Bucket: S3_BUCKET,
    //     Key: serviceData.name,
    //     Expires: 60,
    //     ContentType: serviceData.type,
    //     ACL: 'public-read'
    //   }
    //   return s3.getSignedUrl('putObject', options, function(err, data){
    //     console.log(err);
    //     if(err) {
    //       cb()
    //     }else{
    //       var resData = {
    //         signed_request: data,
    //         url: 'https://s3-eu-central-1.amazonaws.com/'+ S3_BUCKET + '/' + serviceData.name
    //       }
    //       console.log(resData);
    //       cb(null, resData);
    //       //cb(resData);
    //     }
    //
    // })
    // Service.upsert( serviceData, function (err, res) {
    //     cb(null, res);
    // });
  }
  Service.remoteMethod('uploadFile', {
    http: { path: '/uploadFile', verb: 'post' },
    accepts: {
      arg: 'file',
      type: 'object',
      http: { source: 'body' }
    },
    returns: { arg: 'service', type: 'object' }
  });


  Service.upload = function (req, cb) {
    //console.log('from service.js',req.files);
    cb(null, req);

    // const form = new multiparty.Form();
    // form.parse(req, (err, fields, files) => {
    //   if (err){
    //       console.log(err);
    //   }
    //   const file = files['file'][0]; // get the file from the returned files object
    //   console.log(file);
    //   cb(null,file);
    // });
  }

  Service.remoteMethod('upload', {
    http: { path: '/upload', verb: 'post' },
    accepts: {
      arg: 'req',
      type: 'object',
      http: { source: 'body' }
    },
    returns: { arg: 'response', type: 'any' }
  });

  Service.uploadImage = function (req, res, body, cb) {
    //console.log(res);
    try {
      const { name: storageName, root: storageRoot } = Service.app.dataSources.storage.settings;
      //console.log(storageName);
      if (storageName === 'storage') {
        const path = `${storageRoot}${BUCKET}/`;

        if (!fs.existsSync(path)) {
          //console.log(path)
          fs.mkdirSync(path);
        }
      }
    } catch (error) {
      //console.log(error);
    }

    const Container = Service.app.models.Container;
    const form = new formidable.IncomingForm();
    //console.log(Container);
    //console.log(form);
    const filePromise = new Promise((resolve, reject) => {
      //console.log(res);
      Container.upload(req, res, {
        container: BUCKET,
        getFilename: function (fileInfo, req, res) {
          var origFilename = fileInfo.name;

          var parts = origFilename.split('.'),
            partName = parts[0],
            extension = parts[parts.length - 1];
          var newFilename = (new Date()).getTime() + Math.floor((Math.random() * 100000000) + 1) + '_' + partName + '.' + extension;
          return newFilename;
        }
      }, (error, fileObj) => {
        //console.log("krish",fileObj);
        if (error) {
          //console.log(error);
          return reject(error);
        }

        const fileInfo = fileObj.files.file[0];

        resolve(fileInfo);
      });
    });

    const fieldsPromise = new Promise((resolve, reject) => {
      form.parse(req, function (error, fields, files) {
        if (error) return reject(error);

        resolve(fields);
      });
    });

    Promise.all([filePromise, fieldsPromise])
      .then(([fileInfo, fields]) => {
        //console.log(fileInfo);
        // S3 file url
        // const url = (fileInfo.providerResponse && fileInfo.providerResponse.location);
        // Asset.create(Object.assign({
        //   filename: fileInfo.name,
        //   url,
        //   type: fileInfo.type,
        //   size: fileInfo.size
        // }, fields), (error, reply) => {
        //   if (error) return cb(error);
        //   cb(null, reply);
        // });
        const fileUrl = 'https://s3.' + BUCKETZONE + '.amazonaws.com/' + BUCKET + '/' + fileInfo.name;
        const reply = { "type": "success", "url": fileUrl };
        cb(null, reply);
      })
      .catch(error => {
        //console.log(error)
        cb(error)
      });
  }

  Service.remoteMethod('uploadImage', {
    description: 'Uploads a file',
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'body', type: 'object', http: { source: 'body' } }
    ],
    returns: {
      arg: 'fileObject',
      type: 'object',
      root: true
    },
    http: { verb: 'post' }
  });



  

  // Service.calculatePrice = function (data, cb) {

  //   var response;

  //   Service.app.models.Question.find({ where: { "serviceId": data.id }  }, (err, res) => {
  //     if (err) {
  //       response.type = "error";
  //       response.message = "Please try again later.";
  //       cb(null, response);
  //     }
  //     if (res.length > 0) {
  //       for (var i = 0; i < res.length; i++) {
  //         console.log("res",res[i]);
  //       Service.app.models.Answer.find({where:{"questionId":res[i].id}},(err1,res1)=>{
  //        if(err1)
  //        {

  //        }
  //        console.log("res1",res1);
  //       })
  //       }
  //     }
  //     else {
  //       response.type = "error";
  //       response.message = "No questions available for this question.";
  //       cb(null, response);
  //     }

  //   })


  // }
  // Service.remoteMethod('calculatePrice', {
  //   http: {
  //     path: '/calculatePrice',
  //     verb: 'post'
  //   },
  //   accepts: [
  //     {
  //       arg: 'data',
  //       type: 'object',
  //       http: { source: 'body' }
  //     }
  //   ],
  //   returns: {
  //     arg: 'response',
  //     type: 'object'
  //   }
  // });
};
