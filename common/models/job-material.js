'use strict';

module.exports = function (Jobmaterial) {
    Jobmaterial.insertJobMaterial = function (data, cb) {
        var response = {};
        var entryData = [];
        if(data['materials'])
        {
            for (var i = 0; i < data['materials'].length; i++) {

                let insertData = { "count": data['materials'][i].count, "price": data['materials'][i].price, "jobId": data.jobId, "materialsId": data['materials'][i].materialsId };
                entryData.push(insertData);
            }
            Jobmaterial.remove({ "jobId": data.jobId }, (err1, res1) => {
                if (err1) {
                    response.type = "error";
                    response.message = err;
                    cb(null, response);
                }
                Jobmaterial.create(entryData, (err, res) => {
                    if (err) {
                        response.type = "error";
                        response.message = err;
                        cb(null, response);
                    }
                    response.type = "success";
                    response.message = "success";
                    cb(null, response);
                });
            })
        }
        else
        {
            response.type = "error";
            response.message = "Plesae give proper data.";
            cb(null, response);
        }
       






    }
    Jobmaterial.remoteMethod('insertJobMaterial', {
        http: { path: '/insertJobMaterial', verb: 'post' },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });
};
