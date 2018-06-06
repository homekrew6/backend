'use strict';

module.exports = function(Workerlocation) {

    Workerlocation.insertWorkerLocation = function (data, cb) {
        var response = {};
        if (data['zoneIds']) {
            var entryData = [];
            for (var i = 0; i < data['zoneIds'].length; i++) {

                let insertData = { "workerId": data.workerId, "zoneId": data['zoneIds'][i] };
                entryData.push(insertData);
            }

            Workerlocation.remove({ "workerId": data.workerId }, (err1, res1) => {
                if (err1) {
                    response.type = "error";
                    response.message = err;
                    cb(null, response);
                }
                Workerlocation.create(entryData, (err, res) => {
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
        else {
            response.type = "error";
            response.message = "Please give proper format";
            cb(null, response);
        }
      
    }
    Workerlocation.remoteMethod('insertWorkerLocation', {
        http: { path: '/insertWorkerLocation', verb: 'post' },
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
