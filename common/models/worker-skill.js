'use strict';

module.exports = function (Workerskill) {

    Workerskill.insertWorkerSkill = function (data, cb) {
        var response = {};
        if (data['serviceIds']) {
            var entryData = [];
            for (var i = 0; i < data['serviceIds'].length; i++) {

                let insertData = { "workerId": data.workerId, "serviceId": data['serviceIds'][i] };
                entryData.push(insertData);
            }
            console.log(entryData);
            Workerskill.remove({ "workerId": data.workerId }, (err1, res1) => {
                if (err1) {
                    response.type = "error";
                    response.message = err;
                    cb(null, response);
                }
                Workerskill.create(entryData, (err, res) => {
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
        // Workerskill.remove({ "workerId": data.workerId }, (err1, res1) => {
        //     if (err1) {
        //         response.type = "error";
        //         response.message = err;
        //         cb(null, response);
        //     }
        //     response.message = res1;
        //     cb(null, response);
        // })

    }
    Workerskill.remoteMethod('insertWorkerSkill', {
        http: { path: '/insertWorkerSkill', verb: 'post' },
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
