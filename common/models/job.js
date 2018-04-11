'use strict';

var FCM = require('fcm-push');
var userServerKey = 'AIzaSyDXBq375kG8CSjsKeX11EmtQWCmyQ14ATE';
var workerServerKey = 'AIzaSyDXBq375kG8CSjsKeX11EmtQWCmyQ14ATE';
var fcm = new FCM(workerServerKey);
var fcm1 = new FCM(userServerKey);
module.exports = function (Job) {



    Job.insertNewJob = function (data, cb) {

        var response = {};
        const postingTime = new Date();
        let insertData = { price: data.price, postedDate: new Date(data.postedDate).toUTCString(), payment: data.payment, faourite_sp: data.faourite_sp, promo_code: data.promo_code, status: "STARTED", customerId: data.customerId, currencyId: data.currencyId ? data.currencyId : 0, workerId: 0, zoneId: data.zoneId ? data.zoneId : 0, serviceId: data.serviceId, userLocationId: data.userLocationId, postingTime: postingTime, IsFollowUp: false };
        Job.create(insertData, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            if (data.faourite_sp) {
                Job.app.models.Worker.findById(data.faourite_sp, (err1, res1) => {
                    if (err1) {
                        response.type = "Error";
                        response.message = err1;
                        cb(null, response);
                    }
                    if (res1.deviceToken) {
                        //  let pushData = { "to": res1.deviceToken, "screenName": "AvailableJobs", "title": "New job posted.", "body": "You have a new job request." };
                        var message = {
                            to: res1.deviceToken,
                            data: {
                                "screenType": "AvailableJobs"
                            },
                            notification: {
                                title: "New job posted.",
                                body: "You have a new job request."
                            }
                        };
                        fcm.send(message, function (err, fcmResponse) {
                            if (err) {
                                response.type = "error";
                                response.message = err;
                                cb(null, response);
                            } else {
                                response.type = "success";
                                response.message = "Job request sent successfully.";
                                cb(null, response);
                            }
                        });
                    }
                    else {
                        response.type = "Success";
                        response.message = "Job posted successfully but your favourite SP is not available right now.";
                    }
                })
            }
            else {
                data.saveDbDay = data.saveDbDay.toLowerCase();
                Job.app.models.WorkerSkill.find({ "serviceId": data.serviceId }, (err, res) => {
                    if (err) {
                        response.type = "error";
                        response.message = err;
                        cb(null, response);
                    }
                    if (res.length > 0) {
                        let workerIds = [];
                        for (var i = 0; i < res.length; i++) {
                            var data1 = { "workerId": res[i].workerId };
                            workerIds.push(data1);
                        }
                        var registrationIds = [];
                        var filter = '"where":{"or":' + workerIds + '}';
                        Job.app.models.Worker.find({ "where": { "or": workerIds } }, (error, success) => {
                            if (error) {
                                response.type = "error";
                                response.message = error;
                                cb(null, response);
                            }
                            var fullWokerList = [];
                            fullWokerList = success;
                            var filter = '{"where":{"or":' + workerIds + '}}';
                            Job.app.models.Workeravailabletiming.find({ filter }, (err1, res1) => {
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

                                                if (res1[i].timings[j][data.saveDbDay] == true) {
                                                    pushData.timings.push(res1[i].timings[j]);
                                                }
                                            }
                                        }
                                        availableDay.push(pushData);
                                    }
                                    for (var i = 0; i < availableDay.length; i++) {
                                        for (var j = 0; j < availableDay[i].timings.length; j++) {
                                            if (availableDay[i].timings[j].time == data.saveDBTime) {
                                                finalWorkerIds.push(availableDay[i].workerId);
                                            }
                                        }
                                    }
                                    for (var i = 0; i < fullWokerList.length; i++) {
                                        if (finalWorkerIds.includes(fullWokerList[i].id)) {
                                            fullWokerList[i].IsAvailable = true;
                                            if (fullWokerList[i].deviceToken)
                                                registrationIds.push(fullWokerList[i].deviceToken);
                                        }
                                        else {
                                            fullWokerList[i].IsAvailable = false;
                                        }
                                    }


                                    // response.type = "success";
                                    // response.list = fullWokerList;
                                    // cb(null, response);
                                    var message = {
                                        registration_ids: registrationIds,
                                        data: {
                                            "screenType": "AvailableJobs"
                                        },
                                        notification: {
                                            title: "New job posted.",
                                            body: "You have a new job request."
                                        }
                                    };
                                    fcm.send(message, function (err, fcmResponse) {
                                        if (err) {
                                            response.type = "error";
                                            response.message = err;
                                            cb(null, response);
                                        } else {
                                            response.type = "success";
                                            response.message = "Job posted successfully.";
                                            cb(null, response);
                                        }
                                    });
                                }

                                else {
                                    response.type = "error";
                                    response.message = "Job posted but No timings available for Service providers";
                                    cb(null, response);
                                }

                            });
                        })


                    }
                    else {
                        response.typ = "error";
                        response.message = 'No Service provider for the chosen service';
                        cb(null, response);
                    }
                })
            }
        })
    }



    Job.remoteMethod('insertNewJob', {
        http: {
            path: '/insertNewJob',
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


    // Job.getJobListingForWorker = function (data, cb) {

    //     var response = {};
    //     Job.app.models.WorkerSkill.find({ "where": { "workerId": data.workerId } }, (err, res) => {
    //         if (err) {
    //             response.type = "Error";
    //             response.message = err;
    //             cb(null, response);
    //         }
    //         let serviceIds = [];
    //         for (let i = 0; i < res.length; i++) {
    //             serviceIds.push(res[i].serviceId);
    //         }

    //         Job.find({ where: { serviceId: { inq: serviceIds } }, include: ["service", "zone", "userLocation"], "order": "postedDate ASC" }, (err1, res1) => {
    //             if (err1) {
    //                 response.type = "Error";
    //                 response.message = err1;
    //                 cb(null, response);
    //             }
    //             else {
    //                 var jobs = {};
    //                 jobs.upcomingJobs = [];
    //                 jobs.acceptedJobs = [];
    //                 jobs.declinedJobs = [];
    //                 for (let i = 0; i < res1.length; i++) {
    //                     if (res1[i].status == "STARTED") {
    //                         jobs.upcomingJobs.push(res1[i]);
    //                     }
    //                 }

    //                 Job.find({ "where": { "workerId": data.workerId }, include: ["service", "zone", "userLocation"], "order": "postedDate ASC" }, (err2, res2) => {
    //                     if (err2) {
    //                         response.type = "Error";
    //                         response.message = err2;
    //                         cb(null, response);
    //                     }
    //                     for (let i = 0; i < res2.length; i++) {
    //                         if (res2[i].status == "ACCEPTED") {
    //                             jobs.acceptedJobs.push(res2[i]);
    //                         }
    //                         else if (res2[i].status == "DECLINED") {
    //                             jobs.declinedJobs.push(res2[i]);
    //                         }
    //                     }
    //                     response.type = "Success";
    //                     response.message = jobs;
    //                     cb(null, response);
    //                 })
    //             }

    //         });

    //     })

    // }
    Job.getJobListingForWorker = function (data, cb) {

        var response = {};
        Job.app.models.WorkerSkill.find({ "where": { "workerId": data.workerId } }, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            let serviceIds = [];
            for (let i = 0; i < res.length; i++) {
                serviceIds.push(res[i].serviceId);
            }

            Job.find({ where: { serviceId: { inq: serviceIds } }, include: ["service", "zone", "userLocation", "customer", "currency"], "order": "postedDate ASC" }, (err1, res1) => {
                if (err1) {
                    response.type = "Error";
                    response.message = err1;
                    cb(null, response);
                }
                else {
                    var jobs = {};
                    jobs.upcomingJobs = [];
                    jobs.acceptedJobs = [];
                    jobs.declinedJobs = [];
                    jobs.completedJobs = [];

                    Job.find({ "where": { "workerId": data.workerId }, include: ["service", "zone", "userLocation", "customer", "currency"], "order": "postedDate ASC" }, (err2, res2) => {
                        if (err2) {
                            response.type = "Error";
                            response.message = err2;
                            cb(null, response);
                        }
                        else {

                            Job.app.models.declinedJobs.find({ "where": { "workerId": data.workerId }, include: ["service", "job"] }, (err3, res3) => {
                                if (err3) {
                                    response.type = "Error";
                                    response.message = err3;
                                    cb(null, response);
                                }
                                else {
                                    if (res3.length && res3.length > 0) {
                                        for (let i = 0; i < res3.length; i++) {
                                            jobs.declinedJobs.push(res3[i]);
                                        }
                                        for (let j = 0; j < res2.length; j++) {
                                            if (res2[j].status == "ACCEPTED" || res2[j].status == "ONMYWAY" || res2[j].status == "JOBSTARTED") {
                                                let index;
                                                for (let k = 0; k < jobs.declinedJobs.length; k++) {
                                                    if (jobs.declinedJobs[k].jobId == res2[j].id && jobs.declinedJobs[k].workerId == res2[j].workerId) {
                                                        index = k;
                                                    }
                                                }
                                                if (index || index == 0) { }
                                                else {
                                                    jobs.acceptedJobs.push(res2[j]);
                                                }
                                            }
                                            else if (res2[j].status == "COMPLETED") {
                                                jobs.completedJobs.push(res2[j]);
                                            }
                                        }
                                        for (let i = 0; i < res1.length; i++) {
                                            if (res1[i].status == "STARTED") {
                                                let index;
                                                for (let k = 0; k < jobs.declinedJobs.length; k++) {
                                                    // if (jobs.declinedJobs[k].jobId == res1[i].id && jobs.declinedJobs[k].workerId == res1[i].workerId) {
                                                    //     index = k;
                                                    // }
                                                    if (jobs.declinedJobs[k].jobId == res1[i].id) {
                                                        index = k;
                                                    }
                                                }
                                                if (index || index == 0) { }
                                                else {
                                                    jobs.upcomingJobs.push(res1[i]);
                                                }
                                                //jobs.upcomingJobs.push(res1[i]);
                                            }
                                        }
                                        response.type = "Success";
                                        response.message = jobs;
                                        cb(null, response);
                                    }
                                    else {
                                        for (let i = 0; i < res2.length; i++) {
                                            if (res2[i].status == "ACCEPTED" || res2[i].status == "ONMYWAY" || res2[i].status == "JOBSTARTED") {
                                                jobs.acceptedJobs.push(res2[i]);
                                            }
                                        }
                                        for (let i = 0; i < res1.length; i++) {
                                            if (res1[i].status == "STARTED") {
                                                jobs.upcomingJobs.push(res1[i]);
                                            }
                                        }
                                        response.type = "Success";
                                        response.message = jobs;
                                        cb(null, response);
                                    }
                                }
                            })

                        }




                    })
                }

            });

        })

    }
    Job.remoteMethod('getJobListingForWorker', {
        http: {
            path: '/getJobListingForWorker',
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

    Job.recheduleCalculatePrice = function (data, cb) {
        var respone = {};
        var response = {};

        const postingTime = new Date(data.postingTime);
        const newDate = new Date();
        var diff = newDate.getTime() - postingTime.getTime();
        diff = diff / 60000;
        diff = Number(diff);
        if(diff<=5)
        {
            respone.type="Success";
            respone.message="0.0";
            cb(null, respone);
        }
        else
        {
            let priceToCharge;
            let hours = diff / 60;
            if (hours > 24) {
                priceToCharge = "";
            }
            else if (hours > 4 && hours < 24) {
                priceToCharge = (50 * (data.price) / 100);
            }
            else if (hours < 4) {
                priceToCharge = (50 * (data.price) / 100);
            }
            priceToCharge=priceToCharge.toFixed(2);
            respone.type="Success";
            respone.message=priceToCharge;
            cb(null, respone);
        }
    }


    Job.remoteMethod('recheduleCalculatePrice', {
        http: {
            path: '/recheduleCalculatePrice',
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
    })


    Job.recheduleJob=function(data, cb){
        Job.findById(data.id, (err1, res1) => {
            if (diff <= 5) {
                var toUpdateJobData = { id: res1.id, price: res1.price, postedDate: data.postedDate, payment: res1.payment, faourite_sp: res1.faourite_sp, promo_code: res1.promo_code, status: res1.status, customerId: res1.customerId, currencyId: res1.currencyId, workerId: res1.workerId, zoneId: res1.zoneId, serviceId: res1.serviceId, userLocationId: res1.userLocationId, postingTime: data.postingTime, prevPostedDate: res1.postedDate, IsRescheduled: true };

                if (err1) {
                    response.type = "Error";
                    response.message = err1;
                    cb(null, response);
                }
                else {
                    Job.upsert(toUpdateJobData, (err2, res2) => {
                        if (err2) {
                            response.type = "Error";
                            response.message = err2;
                            cb(null, response);
                        }
                        else {

                            if (res1.status == "STARTED") {
                                response.type = "SUCCESS";
                                response.message = "Job successfully cancelled with ZERO cancellation fee.";
                                cb(null, response);
                            }
                            else if (res1.status == "ACCEPTED") {
                                Job.app.models.Worker.findById(res1.workerId, (err2, res2) => {
                                    if (err2) {
                                        response.type = "Error";
                                        response.message = err2;
                                        cb(null, response);
                                    }
                                    else {
                                        if (res2.deviceToken) {
                                            var message = {
                                                to: res2.deviceToken,
                                                data: {
                                                    "screenType": "AvailableJobs"
                                                },
                                                notification: {
                                                    title: "You job has been cancelled.",
                                                    body: "You job has been cancelled."
                                                }
                                            };
                                            fcm.send(message, function (err, fcmResponse) {
                                                if (err) {
                                                    response.type = "error";
                                                    response.message = err;
                                                    cb(null, response);
                                                } else {
                                                    response.type = "success";
                                                    response.message = "Job has been cancelled successfully.";
                                                    cb(null, response);
                                                }
                                            });
                                        }

                                    }
                                })
                            }


                        }
                    })
                }


            }
            else {
                let priceToCharge;
                let hours = diff / 60;
                if (hours > 24) {
                    priceToCharge = "";
                }
                else if (hours > 4 && hours < 24) {
                    priceToCharge = (50 * (res1.price) / 100);
                }
                else if (hours < 4) {
                    priceToCharge = (50 * (res1.price) / 100);
                }

                var toUpdateData1 = { id: res1.id, price: priceToCharge, postedDate: data.postedDate, payment: res1.payment, faourite_sp: res1.faourite_sp, promo_code: res1.promo_code, status: res1.status, customerId: res1.customerId, currencyId: res1.currencyId, workerId: res1.workerId, zoneId: res1.zoneId, serviceId: res1.serviceId, userLocationId: res1.userLocationId, postingTime: data.postingTime, prevPostedDate: res1.postedDate, IsRescheduled: true };
                Job.upsert(toUpdateData1, (err, res) => {
                    if (err) {
                        response.type = "Error";
                        response.message = err;
                        cb(null, response);
                    }
                    else {

                        if (res1.status == "STARTED") {
                            response.type = "SUCCESS";
                            response.message = "Job successfully cancelled with ZERO cancellation fee.";
                            cb(null, response);
                        }
                        else if (res1.status == "ACCEPTED") {
                            Job.app.models.Worker.findById(res1.workerId, (err2, res2) => {
                                if (err2) {
                                    response.type = "Error";
                                    response.message = err2;
                                    cb(null, response);
                                }
                                else {
                                    if (res2.deviceToken) {
                                        var message = {
                                            to: res2.deviceToken,
                                            data: {
                                                "screenType": "AvailableJobs"
                                            },
                                            notification: {
                                                title: "You job has been cancelled.",
                                                body: "You job has been cancelled."
                                            }
                                        };
                                        fcm.send(message, function (err, fcmResponse) {
                                            if (err) {
                                                response.type = "error";
                                                response.message = err;
                                                cb(null, response);
                                            } else {
                                                response.type = "SUCCESS";
                                                response.message = "Job has been cancelled successfully.";
                                                cb(null, response);
                                            }
                                        });
                                    }

                                }
                            })
                        }



                    }
                })
            }
        })
    }
    Job.remoteMethod('recheduleJob', {
        http: {
            path: '/recheduleJob',
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
    })
    Job.acceptJob = function (data, cb) {
        var response = {};
        Job.upsert(data, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                Job.app.models.Customer.findById(data.customerId, (err1, res1) => {
                    if (err1) {
                        response.type = "Error";
                        response.message = err1;
                        cb(null, response);
                    }
                    else {
                        if (res1.deviceToken) {
                            var message = {
                                to: res1.deviceToken,
                                data: {
                                    "screenType": "JobDetails",
                                    "jobId": data.id
                                },
                                notification: {
                                    title: "Your Job is being accepted.",
                                    body: "Your Job is being accepted"
                                }
                            };
                            fcm1.send(message, function (err4, fcmResponse) {
                                if (err4) {
                                    response.type = "error";
                                    response.message = err4;
                                    cb(null, response);
                                } else {
                                    response.type = "success";
                                    response.message = "Job accepted successfully.";
                                    cb(null, response);
                                }
                            });
                        }
                        else {
                            response.type = "Success";
                            response.message = "Job accepted successfully but colud'nt inform the customer.";
                            cb(null, response);
                        }
                    }
                })
            }

        })
    }

    Job.remoteMethod('acceptJob', {
        http: {
            path: '/acceptJob',
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


    Job.changeJobStatusByWorker = function (data, cb) {
        var respone = {};
        var response = {};
        Job.upsert(data, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                Job.app.models.Customer.findById(data.customerId, (err1, res1) => {
                    if (err1) {
                        response.type = "Error";
                        response.message = err1;
                        cb(null, response);
                    }
                    else {
                        if (res1.deviceToken) {
                            var message = {
                                to: res1.deviceToken,
                                data: {
                                    "screenType": "MyJobs",
                                    "jobId": data.id
                                },
                                notification: {
                                    title: data.status == 'ONMYWAY' ? 'The worker is on the way.' : 'The worker has started the job.',
                                    body: data.status == 'ONMYWAY' ? 'The worker is on the way.' : 'The worker has started the job.'
                                }
                            };
                            if (data.status != 'ONMYWAY') {
                                const dataToInsert = { jobId: data.id, startTime: data.startTime, endTime: data.endTime };
                                Job.app.models.jobstartTime.upsert(dataToInsert, (err5, res5) => {
                                    if (err5) {
                                        response.type = "error";
                                        response.message = err5;
                                        cb(null, response);
                                    }
                                    else {

                                        fcm.send(message, function (err4, fcmResponse) {
                                            if (err4) {
                                                response.type = "error";
                                                response.message = err4;
                                                cb(null, response);
                                            } else {
                                                response.type = "success";
                                                response.message = "Job status changed successfully.";
                                                cb(null, response);
                                            }
                                        });
                                    }
                                })
                            }
                            else {

                                fcm.send(message, function (err4, fcmResponse) {
                                    if (err4) {
                                        response.type = "error";
                                        response.message = err4;
                                        cb(null, response);
                                    } else {
                                        response.type = "success";
                                        response.message = "Job status changed successfully.";
                                        cb(null, response);
                                    }
                                });
                            }

                        }
                        else {
                            response.type = "Success";
                            response.message = "Job status changed successfully.";
                            cb(null, response);
                        }
                    }
                })

            }

        })
    }

    Job.remoteMethod('changeJobStatusByWorker', {
        http: {
            path: '/changeJobStatusByWorker',
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
    Job.declineJob = function (data, cb) {
        var response = {};
        var toInsertData = { jobId: data.jobId, workerId: data.workerId, status: "DECLINED", "reason": "", "serviceId": data.serviceId };
        Job.app.models.declinedJobs.create(toInsertData, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                response.typ = "Success";
                response.message = "You have successfully declined the job.";
                cb(null, response);
            }
        });

    }


    Job.remoteMethod('declineJob', {
        http: {
            path: '/declineJob',
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

    Job.cancelJob = function (data, cb) {
        var response = {};
        Job.app.models.declinedJobs.upsert(data, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                Job.findById(data.jobId, (err1, res1) => {
                    if (err) {
                        response.type = "Error";
                        response.message = err;
                        cb(null, response);
                    }
                    else {
                        if (res1.customerId) {
                            Job.app.models.Customer.find({ "where": { "id": res1.customerId } }, (err2, res2) => {
                                if (err2) {
                                    response.type = "Error";
                                    response.message = err2;
                                    cb(null, response);
                                }
                                else {
                                    if (res2.length > 0 && res2[0].deviceToken) {
                                        var message = {
                                            to: res2.deviceToken,
                                            data: {
                                                "screenType": "MyJobs",
                                                "jobId": data.jobId
                                            },
                                            notification: {
                                                title: "Your Job is cancelled.",
                                                body: "Your Job is cancelled."
                                            }
                                        };
                                        fcm.send(message, function (err4, fcmResponse) {
                                            if (err4) {
                                                response.type = "error";
                                                response.message = err4;
                                                cb(null, response);
                                            } else {
                                                response.type = "success";
                                                response.message = "Job cancelled successfully.";
                                                cb(null, response);
                                            }
                                        });
                                    }
                                    else {
                                        response.type = "Error";
                                        response.message = "Job Cancelled successfully but device token not found for customer.";
                                        cb(null, response);
                                    }
                                }
                            });
                        }
                        else {
                            response.type = "Error";
                            response.message = "No customer found.";
                            cb(null, response);
                        }
                    }
                });
            }
        })

    }


    Job.remoteMethod('cancelJob', {
        http: {
            path: '/cancelJob',
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

    Job.cancelJobByUser = function (data, cb) {
        var response = {};

        const postingTime = new Date(data.postingTime);
        const newDate = new Date();
        console.log("postingDate", postingTime);
        console.log("newDate", newDate);
        //    // var timeDiff = Math.abs(postedDate - newDate) / 36e5;
        var diff = newDate.getTime() - postingTime.getTime();
        diff = diff / 60000;
        diff = Number(diff);
        Job.findById(data.id, (err1, res1) => {
            if (diff <= 5) {


                if (err1) {
                    response.type = "Error";
                    response.message = err1;
                    cb(null, response);
                }
                else {
                    var toUpdateData = { id: data.id, status: data.status };
                    Job.upsert(toUpdateData, (err, res) => {
                        if (err) {
                            response.type = "Error";
                            response.message = err;
                            cb(null, response);
                        }
                        else {
                            toUpdateData = { jobId: data.id, workerId: "0", serviceId: res1.serviceId, status: "CANCELLED", reason: data.reason };
                            Job.app.models.declinedJobs.upsert(toUpdateData, (errorRes, finalRes) => {
                                if (errorRes) {
                                    response.type = "Error";
                                    response.message = errorRes;
                                    cb(null, response);
                                }
                                else {
                                    if (res1.status == "STARTED") {
                                        response.type = "SUCCESS";
                                        response.message = "Job successfully cancelled with ZERO cancellation fee.";
                                        cb(null, response);
                                    }
                                    else if (res1.status == "ACCEPTED") {
                                        Job.app.models.Worker.findById(res1.workerId, (err2, res2) => {
                                            if (err2) {
                                                response.type = "Error";
                                                response.message = err2;
                                                cb(null, response);
                                            }
                                            else {
                                                if (res2.deviceToken) {
                                                    var message = {
                                                        to: res2.deviceToken,
                                                        data: {
                                                            "screenType": "AvailableJobs"
                                                        },
                                                        notification: {
                                                            title: "You job has been cancelled.",
                                                            body: "You job has been cancelled."
                                                        }
                                                    };
                                                    fcm.send(message, function (err, fcmResponse) {
                                                        if (err) {
                                                            response.type = "error";
                                                            response.message = err;
                                                            cb(null, response);
                                                        } else {
                                                            response.type = "success";
                                                            response.message = "Job has been cancelled successfully.";
                                                            cb(null, response);
                                                        }
                                                    });
                                                }

                                            }
                                        })
                                    }
                                }
                            })

                        }
                    })
                }


            }
            else {
                let priceToCharge;
                let hours = diff / 60;
                if (hours > 24) {
                    priceToCharge = "";
                }
                else if (hours > 4 && hours < 24) {
                    priceToCharge = (50 * (res1.price) / 100);
                }
                else if (hours < 4) {
                    priceToCharge = (50 * (res1.price) / 100);
                }

                var toUpdateData1 = { id: data.id, status: data.status, priceToCharge: priceToCharge };
                Job.upsert(toUpdateData1, (err, res) => {
                    if (err) {
                        response.type = "Error";
                        response.message = err;
                        cb(null, response);
                    }
                    else {
                        toUpdateData1 = { jobId: data.id, workerId: "0", serviceId: res1.serviceId, status: "CANCELLED", reason: data.reason };
                        Job.app.models.declinedJobs.upsert(toUpdateData1, (fianlError, finalRes) => {
                            if (fianlError) {
                                response.type = "Error";
                                response.message = fianlError;
                                cb(null, response);
                            }
                            else {
                                if (res1.status == "STARTED") {
                                    response.type = "SUCCESS";
                                    response.message = "Job successfully cancelled with ZERO cancellation fee.";
                                    cb(null, response);
                                }
                                else if (res1.status == "ACCEPTED") {
                                    Job.app.models.Worker.findById(res1.workerId, (err2, res2) => {
                                        if (err2) {
                                            response.type = "Error";
                                            response.message = err2;
                                            cb(null, response);
                                        }
                                        else {
                                            if (res2.deviceToken) {
                                                var message = {
                                                    to: res2.deviceToken,
                                                    data: {
                                                        "screenType": "AvailableJobs"
                                                    },
                                                    notification: {
                                                        title: "You job has been cancelled.",
                                                        body: "You job has been cancelled."
                                                    }
                                                };
                                                fcm.send(message, function (err, fcmResponse) {
                                                    if (err) {
                                                        response.type = "error";
                                                        response.message = err;
                                                        cb(null, response);
                                                    } else {
                                                        response.type = "SUCCESS";
                                                        response.message = "Job has been cancelled successfully.";
                                                        cb(null, response);
                                                    }
                                                });
                                            }

                                        }
                                    })
                                }
                            }
                        })

                    }
                })
            }
        })


    }
    Job.remoteMethod('cancelJobByUser', {
        http: {
            path: '/cancelJobByUser',
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

    Job.getJobListingForAdmin = function (cb) {
        var response = {};
        Job.find({ include: ["customer", "worker", "service", "currency"] }, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                response.type = "Success";
                response.message = res;
                cb(null, response);
            }
        });
    }

    Job.remoteMethod('getJobListingForAdmin', {
        http: {
            path: '/getJobListingForAdmin',
            verb: 'GET'
        },
        returns: { arg: 'response', type: 'object' }
    });


    Job.checkIfThePostingDateIsValid = function (data, cb) {
        var response = {};
        Job.app.models.WorkerSkill.find({ "serviceId": data.serviceId }, (err, res) => {
            if (err) {
                response.type = "error";
                response.message = err;
                cb(null, response);
            }
            if (res.length > 0) {
                data.saveDbDay = data.saveDbDay.toLowerCase();
                let workerIds = [];
                for (var i = 0; i < res.length; i++) {
                    var data1 = { "workerId": res[i].workerId };
                    workerIds.push(data1);
                }
                var filter = '"where":{"or":' + workerIds + '}';
                Job.app.models.Worker.find({ "where": { "or": workerIds } }, (error, success) => {
                    if (error) {
                        response.type = "error";
                        response.message = error;
                        cb(null, response);
                    }
                    var fullWokerList = [];
                    fullWokerList = success;
                    var filter = '{"where":{"or":' + workerIds + '}}';
                    Job.app.models.Workeravailabletiming.find({ filter }, (err1, res1) => {
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

                                        if (res1[i].timings[j][data.saveDbDay] == true) {
                                            pushData.timings.push(res1[i].timings[j]);
                                        }
                                    }
                                }
                                availableDay.push(pushData);
                            }
                            for (var i = 0; i < availableDay.length; i++) {
                                for (var j = 0; j < availableDay[i].timings.length; j++) {
                                    if (availableDay[i].timings[j].time == data.saveDBTime) {
                                        finalWorkerIds.push(availableDay[i].workerId);
                                    }
                                }
                            }
                            var IsValid = true;
                            for (var i = 0; i < fullWokerList.length; i++) {
                                if (finalWorkerIds.includes(fullWokerList[i].id)) {
                                    fullWokerList[i].IsAvailable = true;
                                    IsValid = true;
                                    break;
                                }
                                else {
                                    IsValid = false;
                                    fullWokerList[i].IsAvailable = false;
                                }
                            }
                            if (IsValid) {
                                response.type = "Success";
                                response.message = "Worker available for the mentioned date.";
                                cb(null, response);
                            }
                            else {
                                response.type = "Error";
                                response.message = "No worker available for the mentioned date.";
                                cb(null, response);
                            }



                        }

                        else {
                            response.type = "error";
                            response.message = "Job posted but No timings available for Service providers";
                            cb(null, response);
                        }

                    });
                })


            }
            else {
                response.typ = "error";
                response.message = 'No Service provider for the chosen service';
                cb(null, response);
            }
        })

    }
    Job.remoteMethod('checkIfThePostingDateIsValid', {
        http: {
            path: '/checkIfThePostingDateIsValid',
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
    Job.getJobListingForUser = function (data, cb) {
        var response = {};

        if (data.status == "ALL") {
            Job.find({ "where": { "customerId": data.customerId }, include: ["service", "userLocation", "worker", "currency"], "order": "id DESC"}, (err, res) => {
                if (err) {
                    response.type = "Error";
                    response.message = err;
                    cb(null, response);
                }
                else {

                    response.type = "Success";
                    response.message = res;
                    cb(null, response);
                    // var services = {};
                    // let serviceList = [];
                    // for (var i = 0; i < res.length; i++) {
                    //     var serviceId = res[i].serviceId;
                    //     if (!services[serviceId]) {
                    //         services[serviceId] = [];
                    //     }

                    //     services[serviceId].push(res[i]);


                    // }
                    // var finalList = [];
                    // for (let key in services) {
                    //     finalList.push(services[key]);
                    // }
                    // response.type = "Success";
                    // response.message = finalList;
                    // cb(null, response);


                }
            })
        }
        else if (data.status == "ACCEPTED" || data.status == "COMPLETED" || data.status == "STARTED" || data.status == "ONMYWAY" || data.status == "JOBSTARTED") {
            Job.find({ "where": { "customerId": data.customerId, "status": data.status }, include: ["service", "userLocation", "worker", "currency"], "order": "id DESC" }, (err, res) => {
                if (err) {
                    response.type = "Error";
                    response.message = err;
                    cb(null, response);
                }
                else {

                    // var services = {};
                    // let serviceList = [];
                    // for (var i = 0; i < res.length; i++) {
                    //     var serviceId = res[i].serviceId;
                    //     if (!services[serviceId]) {
                    //         services[serviceId] = [];
                    //     }

                    //     services[serviceId].push(res[i]);


                    // }
                    // var finalList = [];
                    // for (let key in services) {
                    //     finalList.push(services[key]);
                    // }

                    response.type = "Success";
                    response.message = res;
                    cb(null, response);
                }
            })
        }

        else if (data.status == "DECLINED" || data.status == "CANCELLED") {
            Job.app.models.declinedJobs.find({ "where": { "status": data.status } }, (err, res) => {
                if (err) {
                    response.type = "Error";
                    response.message = err;
                    cb(null, response);
                }
                else {
                    if (res.length > 0) {
                        var finalJobIds = [];
                        for (let i = 0; i < res.length; i++) {
                            var data1 = { "id": res[i].jobId };
                            finalJobIds.push(data1);
                        }
                        var filter = '"where":{"or":' + finalJobIds + '}';
                        Job.find({ "where": { "or": finalJobIds }, include: ["service", "userLocation", "worker", "currency"], "order": "id DESC"}, (err1, res1) => {
                            if (err1) {
                                response.type = "Error";
                                response.message = err1;
                                cb(null, response);
                            }
                            else {
                                if (res1.length > 0) {
                                    var finalArray = [];
                                    for (let i = 0; i < res1.length; i++) {
                                        if (res1[i].customerId == data.customerId) {
                                            // if (data.status == "DECLINED") {
                                            //     res1[i].status = "DECLINED";
                                            // }
                                            // else if (data.status == "CANCELLED") {
                                            //     res1[i].status = "CANCELLED";
                                            // }
                                            if (data.status == "CANCELLED") {
                                                res1[i].status = "CANCELLED";
                                            }
                                            finalArray.push(res1[i]);
                                        }
                                    }
                                    response.type = "Success";
                                    response.message = finalArray;
                                    cb(null, response);
                                }
                                else {
                                    response.type = "Success";
                                    response.message = [];
                                    cb(null, response);
                                }

                            }
                        })
                    }
                    else {
                        // Job.find({ "where": { "customerId": data.customerId, "status": data.status }, include: ["service", "userLocation", "worker", "currency"] }, (err, res) => {
                        //     if (err) {
                        //         response.type = "Error";
                        //         response.message = err;
                        //         cb(null, response);
                        //     }
                        //     else {

                        //         response.type = "Success";
                        //         response.message = res;
                        //         cb(null, response);
                        //     }
                        // })
                        response.type = "Success";
                        response.message = [];
                        cb(null, response);
                    }
                }
            })
        }

    }

    Job.remoteMethod('getJobListingForUser', {
        http: {
            path: '/getJobListingForUser',
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


    Job.completeJob = function (data, cb) {
        var response = {};
        Job.upsert(data, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {

                Job.app.models.Customer.findById(data.customerId, (err1, res1) => {
                    if (err1) {
                        response.type = "Error";
                        response.message = err1;
                        cb(null, response);
                    }
                    else {
                        if (res1.deviceToken) {
                            var message = {
                                to: res1.deviceToken,
                                data: {
                                    "screenType": "JobDetails"
                                },
                                notification: {
                                    title: "Your job is completed",
                                    body: "Your job is completed."
                                }
                            };
                            fcm1.send(message, function (err, fcmResponse) {
                                if (err) {
                                    response.type = "error";
                                    response.message = err;
                                    cb(null, response);
                                } else {
                                    Job.app.models.Service.findById(data.serviceId, (err2, res2) => {
                                        if (err2) {
                                            response.type = "Error";
                                            response.message = err2;
                                            cb(null, response);
                                        }
                                        else {
                                            var definedTime = res2.time_interval;
                                            var actualTime = Number(data.actualTime);
                                            var price;
                                            if (actualTime == res2.time_interval) {
                                                price = data.price;
                                            }
                                            else if (actualTime > res2.time_interval) {
                                                var noOfBrackets = actualTime / 15;
                                                var finalNoOfBrackets = Math.ceil(noOfBrackets);
                                                var chargePerHourForBracket = res2.cost_per_hour / 4;
                                                var finalCost = chargePerHourForBracket * finalNoOfBrackets;
                                                if (finalCost < res2.min_charge) {
                                                    finalCost = res2.min_charge;
                                                }
                                                price = finalCost;
                                            }
                                            else {
                                                var noOfBrackets = actualTime / 15;
                                                var finalNoOfBrackets = Math.ceil(noOfBrackets);
                                                var chargePerHourForBracket = res2.cost_per_hour / 4;
                                                var finalCost = chargePerHourForBracket * finalNoOfBrackets;
                                                if (finalCost < res2.min_charge) {
                                                    finalCost = res2.min_charge;
                                                }
                                                price = finalCost;
                                            }
                                            response.type = "success";
                                            response.message = "Job completed successfully.";
                                            response.price = price;
                                            cb(null, response);

                                        }
                                    })

                                }
                            });
                        }
                        else {
                            response.type = "Success";
                            response.message = "Job Completd but couldn't inform customer";
                            cb(null, response);
                        }
                    }
                })
            }
        })


    }

    Job.remoteMethod('completeJob', {
        http: {
            path: '/completeJob',
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

    Job.getAvailableWorkersForAdmin = function (data, cb) {
        var response = {};
        Job.app.models.WorkerSkill.find({ "serviceId": data.serviceId }, (err, res) => {
            if (err) {
                response.type = "error";
                response.message = err;
                cb(null, response);
            }
            if (res.length > 0) {
                data.saveDbDay = data.saveDbDay.toLowerCase();
                let workerIds = [];
                for (var i = 0; i < res.length; i++) {
                    var data1 = { "workerId": res[i].workerId };
                    workerIds.push(data1);
                }
                var filter = '"where":{"or":' + workerIds + '}';
                Job.app.models.Worker.find({ "where": { "or": workerIds } }, (error, success) => {
                    if (error) {
                        response.type = "error";
                        response.message = error;
                        cb(null, response);
                    }
                    var fullWokerList = [];
                    fullWokerList = success;
                    var filter = '{"where":{"or":' + workerIds + '}}';
                    Job.app.models.Workeravailabletiming.find({ filter }, (err1, res1) => {
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

                                        if (res1[i].timings[j][data.saveDbDay] == true) {
                                            pushData.timings.push(res1[i].timings[j]);
                                        }
                                    }
                                }
                                availableDay.push(pushData);
                            }
                            for (var i = 0; i < availableDay.length; i++) {
                                for (var j = 0; j < availableDay[i].timings.length; j++) {
                                    if (availableDay[i].timings[j].time == data.saveDBTime) {
                                        finalWorkerIds.push(availableDay[i].workerId);
                                    }
                                }
                            }
                            for (var i = 0; i < fullWokerList.length; i++) {
                                if (finalWorkerIds.includes(fullWokerList[i].id)) {
                                    fullWokerList[i].IsAvailable = true;
                                }
                                else {
                                    fullWokerList[i].IsAvailable = false;
                                }
                            }
                            response.type = "Success";
                            response.message = fullWokerList;
                            cb(null, response);



                        }

                        else {
                            response.type = "error";
                            response.message = "Job posted but No timings available for Service providers";
                            cb(null, response);
                        }

                    });
                })


            }
            else {
                response.typ = "error";
                response.message = 'No Service provider for the chosen service';
                cb(null, response);
            }
        })
    }
    Job.remoteMethod('getAvailableWorkersForAdmin', {
        http: {
            path: '/getAvailableWorkersForAdmin',
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


    Job.assignJobManually = function (data, cb) {
        var response = {};

        Job.upsert(data, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                Job.findById(data.id, (err1, res1) => {
                    if (err1) {
                        response.type = "Error";
                        response.message = err1;
                        cb(null, response);
                    }
                    else {
                        if (res1.customerId) {
                            Job.app.models.Customer.find({ "where": { "id": res1.customerId } }, (err2, customer) => {
                                if (err2) {
                                    response.type = "Error";
                                    response.message = err2;
                                    cb(null, response);
                                }
                                else {
                                    Job.app.models.Worker.find({ "where": { "id": data.workerId } }, (err3, worker) => {
                                        if (err3) {
                                            response.type = "Error";
                                            response.message = err3;
                                            cb(null, response);
                                        }
                                        else {
                                            if (customer.length > 0 && customer[0].deviceToken && worker.length > 0 && worker[0].deviceToken) {
                                                var message = {
                                                    to: customer[0].deviceToken,
                                                    data: {
                                                        "screenType": "AvailableJobs"
                                                    },
                                                    notification: {
                                                        title: "Your job is being assigned.",
                                                        body: "Your job is being assigned."
                                                    }
                                                };
                                                fcm1.send(message, function (err, fcmResponse) {
                                                    if (err) {
                                                        response.type = "error";
                                                        response.message = err;
                                                        cb(null, response);
                                                    } else {
                                                        var message1 = {
                                                            to: worker[0].deviceToken,
                                                            data: {
                                                                "screenType": "AvailableJobs"
                                                            },
                                                            notification: {
                                                                title: "You have been assigned a new job.",
                                                                body: "You have been assigned a new job."
                                                            }
                                                        };
                                                        fcm.send(message1, function (err, fcmResponse) {
                                                            if (err) {
                                                                response.type = "error";
                                                                response.message = err;
                                                                cb(null, response);
                                                            } else {
                                                                response.type = "Success";
                                                                response.message = "Job assigned successfully.";
                                                                cb(null, response);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }

        })
    }


    Job.remoteMethod('assignJobManually', {
        http: {
            path: '/assignJobManually',
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


    Job.getJobDetailsById = function (data, cb) {
        var response = {};
        Job.find({ where: { id: data.id }, include: ["service", "zone", "userLocation", "customer", "currency", "worker"], "order": "postedDate ASC" }, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                Job.app.models.declinedJobs.find({ where: { jobId: data.id } }, (err2, res2) => {
                    if (err2) {
                        response.type = "Error";
                        response.message = er2;
                        cb(null, response);
                    }
                    else {
                        if (res2.length > 0) {
                            for (let i = 0; i < res2.length; i++) {
                                if (res2[i].jobId == data.id && res2[i].workerId == data.workerId) {
                                    res[0].status = res2[i].status;
                                    break;
                                }
                            }
                            response.type = "Success";
                            response.message = res;
                            cb(null, response);


                        }
                        else {
                            // response.type = "Success";
                            // response.message = res;
                            // cb(null, response);
                            if (res[0].status == 'JOBSTARTED') {

                                Job.app.models.jobstartTime.find({ where: { jobId: data.id } }, (err6, res6) => {
                                    if (err6) {
                                        response.type = "Error";
                                        response.message = err6;
                                        cb(null, response);
                                    }
                                    else {
                                        if (res6.length > 0) {
                                            res[0].jobStartTime = res6[0].startTime;
                                            res[0].jobEndTime = res6[0].endTime;
                                            response.type = "Success";
                                            response.message = res;
                                            cb(null, response);
                                        }
                                        else {
                                            response.type = "Success";
                                            response.message = res;
                                            cb(null, response);
                                        }
                                    }
                                })
                            }
                            else {
                                if (res[0].status != 'CANCELLED') {
                                    Job.app.models.Rating.find({ where: { IsWorkerSender: 1, customerId: res[0].customerId } }, (err1, customerRatingList) => {
                                        if (err1) {
                                            response.type = "Error";
                                            response.message = err1;
                                            cb(null, response);
                                        }
                                        else {
                                            if (customerRatingList.length > 0) {
                                                let rating;
                                                for (let i = 0; i < customerRatingList.length; i++) {
                                                    if (rating) {
                                                        rating = rating + Number(customerRatingList[i].rating);
                                                    }
                                                    else {
                                                        rating = Number(customerRatingList[i].rating);
                                                    }
                                                    rating = rating / (customerRatingList.length);
                                                }
                                                res[0].customerRating = rating;
                                            }
                                            else {
                                                res[0].customerRating = "0";
                                            }

                                            Job.app.models.Rating.find({ where: { IsWorkerSender: 0, workerId: res[0].workerId } }, (err2, workerRatingList) => {
                                                if (err2) {
                                                    response.type = "Error";
                                                    response.message = err2;
                                                    cb(null, response);
                                                }
                                                else {
                                                    if (workerRatingList.length > 0) {
                                                        let rating;
                                                        for (let i = 0; i < workerRatingList.length; i++) {
                                                            if (rating) {
                                                                rating = rating + Number(workerRatingList[i].rating);
                                                            }
                                                            else {
                                                                rating = Number(workerRatingList[i].rating);
                                                            }
                                                        }
                                                        rating = rating / (workerRatingList.length)
                                                        res[0].workerRating = rating;
                                                    }
                                                    else {
                                                        res[0].workerRating = "0";
                                                    }
                                                    response.type = "Success";
                                                    response.message = res;
                                                    cb(null, response);
                                                }
                                            })


                                        }
                                    });
                                }
                                else {
                                    response.type = "Success";
                                    response.message = res;
                                    cb(null, response);
                                }

                            }
                        }


                    }
                })

            }
        })
    }


    Job.remoteMethod('getJobDetailsById', {
        http: {
            path: '/getJobDetailsById',
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




    Job.test = function (data, cb) {
        var response = {};
        Job.find({ where: { id: data.id }, include: ["service", "zone", "userLocation", "customer", "currency", "worker"], "order": "postedDate ASC" }, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                if (res.length > 0) {
                    Job.app.models.Rating.find({ where: { IsWorkerSender: 1, customerId: res[0].customerId } }, (err1, customerRatingList) => {
                        if (err1) {
                            response.type = "Error";
                            response.message = err1;
                            cb(null, response);
                        }
                        else {
                            if (customerRatingList.length > 0) {
                                let rating;
                                for (let i = 0; i < customerRatingList.length; i++) {
                                    if (rating) {
                                        rating = rating + Number(customerRatingList[i].rating);
                                    }
                                    else {
                                        rating = Number(customerRatingList[i].rating);
                                    }
                                }
                                res[0].customerRating = rating;
                            }
                            else {
                                res[0].customerRating = "0";
                            }

                            Job.app.models.Rating.find({ where: { IsWorkerSender: 0, workerId: res[0].workerId } }, (err2, workerRatingList) => {
                                if (err2) {
                                    response.type = "Error";
                                    response.message = err2;
                                    cb(null, response);
                                }
                                else {
                                    if (workerRatingList.length > 0) {
                                        let rating;
                                        for (let i = 0; i < workerRatingList.length; i++) {
                                            if (rating) {
                                                rating = rating + Number(workerRatingList[i].rating);
                                            }
                                            else {
                                                rating = Number(workerRatingList[i].rating);
                                            }
                                        }
                                        res[0].workerRating = rating;
                                    }
                                    else {
                                        res[0].workerRating = "0";
                                    }
                                    response.type = "Success";
                                    response.message = res;
                                    cb(null, response);
                                }
                            })


                        }
                    });
                }
                else {
                    response.type = "Error";
                    response.message = "No job found.";
                    cb(null, response);
                }


            }
        })
    }

    Job.remoteMethod('test', {
        http: {
            path: '/test',
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

    // Job.test = function (data, cb) {

    //     var response = {};
    //     Job.app.models.WorkerSkill.find({ "where": { "workerId": data.workerId } }, (err, res) => {
    //         if (err) {
    //             response.type = "Error";
    //             response.message = err;
    //             cb(null, response);
    //         }
    //         let serviceIds = [];
    //         for (let i = 0; i < res.length; i++) {
    //             serviceIds.push(res[i].serviceId);
    //         }

    //         Job.find({ where: { serviceId: { inq: serviceIds } }, include: ["service", "zone", "userLocation"], "order": "postedDate ASC" }, (err1, res1) => {
    //             if (err1) {
    //                 response.type = "Error";
    //                 response.message = err1;
    //                 cb(null, response);
    //             }
    //             else {
    //                 var jobs = {};
    //                 jobs.upcomingJobs = [];
    //                 jobs.acceptedJobs = [];
    //                 jobs.declinedJobs = [];


    //                 Job.find({ "where": { "workerId": data.workerId }, include: ["service", "zone", "userLocation"], "order": "postedDate ASC" }, (err2, res2) => {
    //                     if (err2) {
    //                         response.type = "Error";
    //                         response.message = err2;
    //                         cb(null, response);
    //                     }
    //                     else {

    //                         Job.app.models.declinedJobs.find({ "where": { "workerId": data.workerId }, include: ["service"] }, (err3, res3) => {
    //                             if (err3) {
    //                                 response.type = "Error";
    //                                 response.message = err3;
    //                                 cb(null, response);
    //                             }
    //                             else {
    //                                 if (res3.length && res3.length > 0) {
    //                                     for (let i = 0; i < res3.length; i++) {
    //                                         jobs.declinedJobs.push(res3[i]);
    //                                     }
    //                                     for (let j = 0; j < res2.length; j++) {
    //                                         if (res2[j].status == "ACCEPTED") {
    //                                             let index;
    //                                             for (let k = 0; k < jobs.declinedJobs.length; k++) {
    //                                                 if (jobs.declinedJobs[k].jobId == res2[j].id && jobs.declinedJobs[k].workerId == res2[j].workerId) {
    //                                                     index = k;
    //                                                 }
    //                                             }
    //                                             if (index || index == 0) { }
    //                                             else {
    //                                                 jobs.acceptedJobs.push(res2[j]);
    //                                             }
    //                                         }
    //                                     }
    //                                     for (let i = 0; i < res1.length; i++) {
    //                                         if (res1[i].status == "STARTED") {
    //                                             let index;
    //                                             for (let k = 0; k < jobs.declinedJobs.length; k++) {
    //                                                 if (jobs.declinedJobs[k].jobId == res1[i].id && jobs.declinedJobs[k].workerId == res1[i].workerId) {
    //                                                     index = k;
    //                                                 }
    //                                             }
    //                                             if (index || index == 0) { }
    //                                             else {
    //                                                 jobs.upcomingJobs.push(res1[i]);
    //                                             }
    //                                             //jobs.upcomingJobs.push(res1[i]);
    //                                         }
    //                                     }
    //                                     response.type = "Success";
    //                                     response.message = jobs;
    //                                     cb(null, response);
    //                                 }
    //                                 else {
    //                                     for (let i = 0; i < res2.length; i++) {
    //                                         if (res2[i].status == "ACCEPTED") {
    //                                             jobs.acceptedJobs.push(res2[i]);
    //                                         }
    //                                     }
    //                                     for (let i = 0; i < res1.length; i++) {
    //                                         if (res1[i].status == "STARTED") {
    //                                             jobs.upcomingJobs.push(res1[i]);
    //                                         }
    //                                     }
    //                                     response.type = "Success";
    //                                     response.message = jobs;
    //                                     cb(null, response);
    //                                 }
    //                             }
    //                         })

    //                     }




    //                 })
    //             }

    //         });

    //     })

    // }

    // Job.remoteMethod('test', {
    //     http: {
    //         path: '/test',
    //         verb: 'POST'
    //     },
    //     accepts: [
    //         {
    //             arg: 'data',
    //             type: 'object',
    //             http: { source: 'body' }
    //         }
    //     ],
    //     returns: { arg: 'response', type: 'object' }
    // });
}                                         