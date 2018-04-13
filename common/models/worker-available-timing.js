'use strict';
var FCM = require('fcm-push');
var serverKey = 'AIzaSyDXBq375kG8CSjsKeX11EmtQWCmyQ14ATE';
// var serverKey = 'AIzaSyDwIfibqZgxiERfhvvm90d_fc2gn82bQ80';
var fcm = new FCM(serverKey);

module.exports = function (Workeravailabletiming) {

    Workeravailabletiming.insertavailabilityForWorker = function (data, cb) {
        var response = {};
        if (data['available-timings']) {
            var entryData = {};
            for (var i = 0; i < data['available-timings'].availability.length; i++) {

                entryData[data['available-timings'].availability[i].week] = { timings: data['available-timings'].availability[i].timings }
            }
            let saveData = { "workerId": data.workerId, "available-timings": entryData };
            Workeravailabletiming.upsert(saveData, (err, res) => {
                if (err) {
                    response.type = "error";
                    response.message = err;
                    cb(null, response);
                }
                response.type = "success";
                response.message = "success";
                cb(null, response);
            });


        }
        else {
            response.type = "error";
            response.message = "Please give proper format";
            cb(null, response);
        }

    }
    Workeravailabletiming.remoteMethod('insertavailabilityForWorker', {
        http: { path: '/insertavailabilityForWorker', verb: 'post' },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });



    // Workeravailabletiming.getUserFavSVListing = function (data, cb) {


    //     var response = {};
    //     var requestData = data;
    //     Workeravailabletiming.app.models.WorkerSkill.find({ "serviceId": data.serviceId }, (err, res) => {
    //         if (err) {
    //             response.type = "error";
    //             response.message = err;
    //             cb(null, response);
    //         }
    //         if (res.length > 0) {
    //             let workerIds = [];
    //             for (var i = 0; i < res.length; i++) {
    //                 var data1 = { "workerId": res[i].workerId };
    //                 workerIds.push(data1);
    //             }
    //             var filter = '"where":{"or":' + workerIds + '}';
    //             Workeravailabletiming.app.models.Worker.find({ "where": { "or": workerIds } }, (error, success) => {
    //                 if (error) {
    //                     response.type = "error";
    //                     response.message = error;
    //                     cb(null, response);
    //                 }
    //                 var fullWokerList = [];
    //                 fullWokerList = success;
    //                 var filter = '{"where":{"or":' + workerIds + '}}';
    //                 Workeravailabletiming.find({ filter }, (err1, res1) => {
    //                     if (err1) {
    //                         response.type = "error";
    //                         response.message = err1;
    //                         cb(null, response);
    //                     }
    //                     if (res1.length > 0) {
    //                         // console.log("response from filter", res1);
    //                         // response.type = "success";
    //                         // response.message = res1;
    //                         // cb(null, response);
    //                         var workersList = [];
    //                         let finalWorkerIds = [];
    //                         // for (var i = 0; i < res1.length; i++) {
    //                         //     if (res1[i].timings) {
    //                         //         for (var j = 0; j < res1[i].timings.length; j++) {
    //                         //             if (res1[i].timings[j].time == requestData.time && res1[i].timings[j][requestData.day] == true) {
    //                         //                 finalWorkerIds.push(res1[i].workerId);
    //                         //             }
    //                         //         }
    //                         //     }
    //                         // }
    //                         var availableDay = [];
    //                         for (var i = 0; i < res1.length; i++) {
    //                             let pushData = { workerId: res1[i].workerId, timings: [] };
    //                             if (res1[i].timings) {
    //                                 for (var j = 0; j < res1[i].timings.length; j++) {
    //                                     if (res1[i].timings[j][requestData.day] == true) {
    //                                         pushData.timings.push(res1[i].timings[j]);
    //                                     }
    //                                 }
    //                             }
    //                             availableDay.push(pushData);
    //                         }


    //                            for(var i=0;i<availableDay.length;i++)
    //                            {
    //                                for (var j = 0; j < availableDay[i].timings.length;j++)
    //                                {
    //                                    if (availableDay[i].timings[j].time==requestData.time)
    //                                    {
    //                                        finalWorkerIds.push(availableDay[i].workerId);
    //                                    }
    //                                }
    //                            }
    //                         // if (finalWorkerIds.length > 0) {
    //                         for (var i = 0; i < fullWokerList.length; i++) {
    //                             if (finalWorkerIds.includes(fullWokerList[i].id)) {
    //                                 fullWokerList[i].IsAvailable = true;
    //                             }
    //                             else {
    //                                 fullWokerList[i].IsAvailable = false;
    //                             }
    //                         }


    //                         response.type = "success";
    //                         response.list = fullWokerList;
    //                         cb(null, response);
    //                         // var filetrWorker = [];
    //                         // for (var i = 0; i < finalWorkerIds.length; i++) {
    //                         //     var data2 = { "id": finalWorkerIds[i] };
    //                         //     filetrWorker.push(data2);
    //                         // }
    //                         // var filter = '"where":{"or":' + filetrWorker + '}';
    //                         // Workeravailabletiming.app.models.Worker.find({ "where": { "or": filetrWorker } }, (error, success) => {
    //                         //     if (error) {
    //                         //         response.type = "error";
    //                         //         response.message = error;
    //                         //         cb(null, response);
    //                         //     }
    //                         //     response.type = "success";
    //                         //     response.list = success;
    //                         //     cb(null, response);
    //                         // })
    //                         // }
    //                         // else {
    //                         //     response.type = "error";
    //                         //     response.message = 'No service provider available at mentioned time';
    //                         //     cb(null, response);
    //                         // }
    //                     }

    //                     else {
    //                         response.type = "error";
    //                         response.message = "No timings available for Service providers";
    //                         cb(null, response);
    //                     }

    //                 });
    //                 // response.type = "success";
    //                 // response.list = success;
    //                 // cb(null, response);
    //             })


    //         }
    //         else {
    //             response.typ = "error";
    //             response.message = 'No Service provider for the chosen service';
    //             cb(null, response);
    //         }
    //         // response.typ = "success";
    //         // response.message = res;
    //         // cb(null, response);
    //     });
    // }
    Workeravailabletiming.getUserFavSVListing = function (data, cb) {


        var response = {};
        var requestData = data;
        var spList = [];
        Workeravailabletiming.app.models.favoriteSp.find({ where: { customerId: data.customerId } }, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                if (res.length > 0) {
                    let workerIds = [];
                    let WorkerIdsList=[];
                    for (var i = 0; i < res.length; i++) {
                        var data1 = { "workerId": res[i].workerId };
                        workerIds.push(data1);
                        WorkerIdsList.push(res[i].workerId);
                    }
                    var filter = '"where":{"or":' + workerIds + '}';
                    Workeravailabletiming.app.models.Worker.find({ "where": { "or": workerIds } }, (error, success) => {
                        if (error) {
                            response.type = "error";
                            response.message = error;
                            cb(null, response);
                        }
                        var fullWokerList = [];
                        for(let m=0;m<success.length;m++)
                        {
                            if (WorkerIdsList.includes(success[m].id))
                            {
                                fullWokerList.push(success[m]);
                            }
                        }
                        //fullWokerList = success;
                        var filter = '{"where":{"or":' + workerIds + '}}';
                        Workeravailabletiming.find({ filter }, (err1, res1) => {
                            if (err1) {
                                response.type = "error";
                                response.message = err1;
                                cb(null, response);
                            }
                            if (res1.length > 0) {

                                var workersList = [];
                                let finalWorkerIds = [];

                                var availableDay = [];
                                for (var i = 0; i < res1.length; i++) {
                                    let pushData = { workerId: res1[i].workerId, timings: [] };
                                    if (res1[i].timings) {
                                        for (var j = 0; j < res1[i].timings.length; j++) {
                                            if (res1[i].timings[j][requestData.day] == true) {
                                                pushData.timings.push(res1[i].timings[j]);
                                            }
                                        }
                                    }
                                    availableDay.push(pushData);
                                }


                                for (var i = 0; i < availableDay.length; i++) {
                                    for (var j = 0; j < availableDay[i].timings.length; j++) {
                                        if (availableDay[i].timings[j].time == requestData.time) {
                                            finalWorkerIds.push(availableDay[i].workerId);
                                        }
                                    }
                                }
                                // if (finalWorkerIds.length > 0) {
                                for (var i = 0; i < fullWokerList.length; i++) {
                                    if (finalWorkerIds.includes(fullWokerList[i].id)) {
                                        fullWokerList[i].IsAvailable = true;
                                    }
                                    else {
                                        fullWokerList[i].IsAvailable = false;
                                    }
                                }


                                response.type = "success";
                                response.list = fullWokerList;
                                cb(null, response);

                            }

                            else {
                                response.type = "error";
                                response.message = "No timings available for Service providers";
                                cb(null, response);
                            }

                        });

                    })
                }
                else {
                    response.type = "Success";
                    response.message = { spList: spList, isfound: false };
                    cb(null, response);
                }
            }
        })

    }
    Workeravailabletiming.remoteMethod('getUserFavSVListing', {
        http: {
            path: '/getUserFavSVListing',
            verb: 'POST'
        },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });




    Workeravailabletiming.sendpush = function (data, cb) {
        var res = {};
        // var message = {
        //     to: 'cpAefoMT0_w:APA91bGV_anY6bumhb31qJIa1vCYqz24vRQWUu-bKzDRwP8KquL5p7w4Ea95I8bNHyFgkmi35w_lI1M_GqH6wgCKgbPF8Yjev0-ck1LtzlseRKD86vgBOef0R3YFm2IHOuhwN_5SLixK', // required fill with device token or topics
        //     data: {
        //         "test":"test",
        //         "test1":"test1"
        //     },
        //     notification: {
        //         title: 'Title of your push notification',
        //         body: 'Body of your push notification'
        //     }
        // };
        // var message = {
        //     to: data.to,
        //     data: data.requestData,
        //     notification: {
        //         title: data.title,
        //         body: data.body
        //     }
        // };
        var message = {
            registration_ids: data.to,
            data: {
                "screenType": "JobDetails",
                "jobId": "37"
            },
            notification: {
                title: "Your Job is being accepted.",
                body: "Your Job is being accepted"
            }
        };

        fcm.send(message, function (err, response) {
            if (err) {
                res.type = "error";
                res.message = err;
                cb(null, res);
            } else {
                res.type = "success";
                res.message = response;
                cb(null, res);
            }
        });

    }
    Workeravailabletiming.remoteMethod('sendpush', {
        http: { path: '/sendpush', verb: 'post' },
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
