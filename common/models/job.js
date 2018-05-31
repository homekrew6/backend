'use strict';

var FCM = require('fcm-push');
var userServerKey_before_release = 'AIzaSyDXBq375kG8CSjsKeX11EmtQWCmyQ14ATE';
var workerServerKey_before_release = 'AIzaSyDXBq375kG8CSjsKeX11EmtQWCmyQ14ATE';
var userServerKey = "AIzaSyDPsQQvaMIUWiL0jb_ftvKlM4OV_IFzZkw";
var workerServerKey = 'AIzaSyDPsQQvaMIUWiL0jb_ftvKlM4OV_IFzZkw';
var fcm = new FCM(workerServerKey);
var fcm1 = new FCM(userServerKey);
module.exports = function (Job) {



    Job.insertNewJob = function (data, cb) {

        //data.questionList = '[{"name":"First Number Question","type":1,"parent_id":0,"option":[],"icon":"fa fa-home","color":"#fff","image":"https://s3.eu-central-1.amazonaws.com/files.homekrew.com/1521089808205_splashscreen.png","is_active":true,"range_name":"","start_range":0,"end_range":0,"IncrementId":2,"selectedRadio":null,"rangeValue":null,"sliderValues":null,"Status":true,"id":39,"serviceId":3,"answers":[{"title":"","icon":"","image":"","option_price_impact":"Addition","price_impact":"12","option_time_impact":"Addition","time_impact":"15","parts":"","scope":"","selected":null,"id":19,"questionId":39,"currencyId":3}]},{"name":"First Boolean Question","type":2,"parent_id":0,"option":[],"icon":"fa fa-home","color":"#fff","image":"https://s3.eu-central-1.amazonaws.com/files.homekrew.com/1521085947631_swiper-2.png","is_active":true,"range_name":"","start_range":0,"end_range":0,"IncrementId":1,"selectedRadio":null,"rangeValue":null,"sliderValues":null,"Status":true,"id":40,"serviceId":3,"answers":[{"title":"","icon":"","image":"","option_price_impact":"Addition","price_impact":"13","option_time_impact":"Addition","time_impact":"13","parts":"","scope":"","selected":null,"id":20,"questionId":40,"currencyId":3}]},{"name":"First Radio Question","type":3,"parent_id":0,"option":[],"icon":"fa fa-home","color":"#fff","image":"https://s3.eu-central-1.amazonaws.com/files.homekrew.com/1521034385329_icon15.png","is_active":true,"range_name":"","start_range":0,"end_range":0,"IncrementId":1,"selectedRadio":null,"rangeValue":null,"sliderValues":null,"Status":true,"id":41,"serviceId":3,"answers":[{"title":"One","icon":"fa fa-home","image":null,"option_price_impact":"Addition","price_impact":"16","option_time_impact":"Addition","time_impact":"14","parts":"","scope":"","selected":false,"id":24,"questionId":41,"currencyId":3},{"title":"Two","icon":"fa fa-home","image":null,"option_price_impact":"Addition","price_impact":"18","option_time_impact":"Addition","time_impact":"12","parts":"part_price","scope":"global","selected":true,"id":25,"questionId":41,"currencyId":3}]},{"name":"First Range Question","type":4,"parent_id":0,"option":[],"icon":"fa fa-home","color":"#fff","image":"https://s3.eu-central-1.amazonaws.com/files.homekrew.com/1521048598909_logo.png","is_active":true,"range_name":"2424","start_range":0.28,"end_range":0,"IncrementId":1,"selectedRadio":null,"rangeValue":null,"sliderValues":null,"Status":true,"id":42,"serviceId":3,"answers":[{"title":"","icon":"","image":"","option_price_impact":"Addition","price_impact":"17","option_time_impact":"Addition","time_impact":"15","parts":"","scope":"","selected":null,"id":21,"questionId":42,"currencyId":3}]},{"name":"First Photo Question","type":5,"parent_id":0,"option":[],"icon":"fa fa-home","color":"#fff","image":"https://s3.eu-central-1.amazonaws.com/files.homekrew.com/1521033716723_london.png","is_active":true,"range_name":"","start_range":0,"end_range":0,"IncrementId":1,"selectedRadio":null,"rangeValue":null,"sliderValues":null,"Status":true,"id":43,"serviceId":3,"answers":[]},{"name":"Second Number Question","type":1,"parent_id":0,"option":[],"icon":"fa fa-home","color":"#fff","image":"https://s3.eu-central-1.amazonaws.com/files.homekrew.com/1521199052442_icon2.png","is_active":true,"range_name":"","start_range":0,"end_range":0,"IncrementId":2,"selectedRadio":null,"rangeValue":null,"sliderValues":null,"Status":true,"id":48,"serviceId":3,"answers":[{"title":"","icon":"fa fa-home","image":"https://s3.eu-central-1.amazonaws.com/files.homekrew.com/1521199052442_icon2.png","option_price_impact":"Multiple","price_impact":"16","option_time_impact":"Addition","time_impact":"13","parts":"","scope":"","selected":null,"id":26,"questionId":48,"currencyId":3}]}]';



        var response = {};
        const postingTime = new Date();
        const orderId = Math.floor(100000 + Math.random() * 900000);
        console.log("data", data);
        // let insertData = { price: data.price, postedDate: new Date(data.postedDate).toUTCString(), payment: data.payment, faourite_sp: data.faourite_sp, promo_code: data.promo_code, status: "STARTED", customerId: data.customerId, currencyId: data.currencyId ? data.currencyId : 0, workerId: 0, zoneId: data.zoneId ? data.zoneId : 0, serviceId: data.serviceId, userLocationId: data.userLocationId, postingTime: postingTime, expectedTimeInterval: data.expectedTimeInterval, promoPrice: data.promoPrice, orderId: orderId, IsPaid: false };
        let insertData = { price: data.price, postedDate: data.postedDate, payment: data.payment, faourite_sp: data.faourite_sp, promo_code: data.promo_code, status: "STARTED", customerId: data.customerId, currencyId: data.currencyId ? data.currencyId : 0, workerId: 0, zoneId: data.zoneId ? data.zoneId : 0, serviceId: data.serviceId, userLocationId: data.userLocationId, postingTime: postingTime, expectedTimeInterval: data.expectedTimeInterval, promoPrice: data.promoPrice, orderId: orderId, IsPaid: false };
        console.log(insertData, "insertDate");
        Job.create(insertData, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            const insertJobSelectionData = { jobId: res.id, questionList: data.questionList };
            Job.app.models.jobSelectedQuestion.remove({ jobId: res.id }, (finalError, finalSuccess) => {
                if (finalError) {
                    response.type = "Error";
                    response.message = finalError;
                    cb(null, response);
                }
                else {
                    Job.app.models.jobSelectedQuestion.create(insertJobSelectionData, (finalErro1, finalSuccess1) => {
                        if (finalErro1) {
                            response.type = "Error";
                            response.message = finalErro1;
                            cb(null, response);
                        }
                        else {
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
                                        const notificationInsertData = { notificationType: "NewJob", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.faourite_sp, jobId: res.id ? res.id : '', IsToWorker: true, IsRead: 0 };
                                        Job.app.models.Notifications.create(notificationInsertData, (finalError, finalSuucess) => {
                                            if (finalError) {
                                                response.type = "Error";
                                                response.message = finalError;
                                                cb(null, response);
                                            }
                                            else {
                                                fcm.send(message, function (err, fcmResponse) {
                                                    if (err) {
                                                        response.type = "success";
                                                        response.message = orderId;
                                                        cb(null, response);
                                                    } else {
                                                        response.type = "success";
                                                        response.message = orderId;
                                                        cb(null, response);
                                                    }
                                                });
                                            }
                                        })

                                    }
                                    else {
                                        response.type = "Success";
                                        response.message = orderId;
                                    }
                                })
                            }
                            else {
                                data.saveDbDay = data.saveDbDay.toLowerCase();
                                Job.app.models.WorkerSkill.find({ where: { "serviceId": data.serviceId } }, (err, res) => {
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

                                        Job.app.models.WorkerLocation.find({ "where": { "or": workerIds } }, (locationError, locationSuccess) => {
                                            if (locationError) {
                                                response.type = "error";
                                                response.message = locationError;
                                                cb(null, response);
                                            }
                                            else {

                                                var completeLocationWorkerList = [];
                                                for (let i = 0; i < locationSuccess.length; i++) {
                                                    if (locationSuccess[i].zoneId == data.zoneId) {
                                                        var data1 = { "workerId": locationSuccess[i].workerId };
                                                        completeLocationWorkerList.push(data1);
                                                    }
                                                }
                                                var registrationIds = [];

                                                var filter = '"where":{"or":' + completeLocationWorkerList + '}';
                                                Job.app.models.Worker.find({ "where": { "or": completeLocationWorkerList } }, (error, success) => {
                                                    if (error) {
                                                        response.type = "error";
                                                        response.message = error;
                                                        cb(null, response);
                                                    }
                                                    var fullWokerList = [];
                                                    fullWokerList = success;
                                                    var filter = '{"where":{"or":' + completeLocationWorkerList + '}}';
                                                    Job.app.models.Workeravailabletiming.find({ "where": { "or": completeLocationWorkerList } }, (err1, res1) => {
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
                                                            let toSentIds = [];
                                                            for (var i = 0; i < fullWokerList.length; i++) {
                                                                if (finalWorkerIds.includes(fullWokerList[i].id)) {
                                                                    fullWokerList[i].IsAvailable = true;
                                                                    if (fullWokerList[i].deviceToken && !fullWokerList[i].isDedicated) {
                                                                        registrationIds.push(fullWokerList[i].deviceToken);
                                                                        toSentIds.push(fullWokerList[i].id);
                                                                    }


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
                                                            var entryData = [];
                                                            for (var k = 0; k < toSentIds.length; k++) {
                                                                let insertData = { notificationType: "NewJob", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: toSentIds[k], jobId: res.id ? res.id : '', IsToWorker: true, IsRead: 0 };
                                                                entryData.push(insertData);
                                                            }

                                                            Job.app.models.Notifications.create(entryData, (finalError2, finalSuccess2) => {
                                                                if (finalError2) {
                                                                    response.type = "Error";
                                                                    response.message = finalError2;
                                                                    cb(null, response);
                                                                }
                                                                else {
                                                                    fcm.send(message, function (err, fcmResponse) {
                                                                        if (err) {
                                                                            response.type = "success";
                                                                            response.message = orderId;
                                                                            cb(null, response);
                                                                        } else {
                                                                            response.type = "success";
                                                                            response.message = orderId;
                                                                            cb(null, response);
                                                                        }
                                                                    });
                                                                }
                                                            })

                                                        }

                                                        else {
                                                            response.type = "error";
                                                            response.message = orderId;
                                                            cb(null, response);
                                                        }

                                                    });
                                                })
                                            }
                                        })



                                    }
                                    else {
                                        response.typ = "error";
                                        response.message = 'No Service provider for the chosen service';
                                        cb(null, response);
                                    }
                                })
                            }
                        }
                    })

                }
            });

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


    function getDay(day) {
        let weekDay;
        switch (day) {
            case 0:
                weekDay = "sun";
                break;
            case 1:
                weekDay = "mon";
                break;
            case 2:
                weekDay = "tue";
                break;
            case 3:
                weekDay = "wed";
                break;
            case 4:
                weekDay = "thu";
                break;
            case 5:
                weekDay = "fri";
                break;
            case 6:
                weekDay = "sat";
                break;
            default:
                break;
        }
        return weekDay;
    }

    Job.getJobListingForWorker = function (data, cb) {

        const toDaysDate = new Date();
        const one_day = 1000 * 60 * 60 * 24;
        var response = {};
        let zoneIds = [];
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
            Job.app.models.Workeravailabletiming.find({ where: { workerId: data.workerId } }, (timingError, timingRes) => {
                if (timingError) {
                    response.type = "Error";
                    response.message = timingError;
                    cb(null, response);
                }
                else {
                    Job.app.models.WorkerLocation.find({ "where": { "workerId": data.workerId } }, (locError, locSuccess) => {
                        if (locError) {
                            response.type = "Error";
                            response.message = locError;
                            cb(null, response);
                        }
                        else {

                            for (let i = 0; i < locSuccess.length; i++) {
                                zoneIds.push(locSuccess[i].zoneId);
                            }
                            Job.find({ where: { serviceId: { inq: serviceIds }, zoneId: { inq: zoneIds }, status: { nin: ['CLOSED'] } }, include: ["service", "zone", "userLocation", "customer", "currency"], "order": "postedDate ASC" }, (err1, res1) => {
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
                                    jobs.onGoingJobs = [];
                                    jobs.cancelledJobs = [];

                                    Job.find({ "where": { "workerId": data.workerId }, include: ["service", "zone", "userLocation", "customer", "currency", "worker"], "order": "postedDate ASC" }, (err2, res2) => {
                                        if (err2) {
                                            response.type = "Error";
                                            response.message = err2;
                                            cb(null, response);
                                        }
                                        else {
                                         console.log("pragati");
                                            Job.app.models.declinedJobs.find({ "where": { "workerId": data.workerId }, include: ["service", "job", "currency"] }, (err3, res3) => {
                                                if (err3) {
                                                    response.type = "Error";
                                                    response.message = err3;
                                                    cb(null, response);
                                                }
                                                else {

                                                    if (res3.length && res3.length > 0) {
                                                        for (let i = 0; i < res3.length; i++) {

                                                            if (res3[i].status == "IGNORED") {
                                                                jobs.declinedJobs.push(res3[i]);
                                                            }
                                                            else if (res3[i].status == "CANCELLED") {
                                                                jobs.cancelledJobs.push(res3[i]);
                                                            }

                                                        }
                                                        for (let j = 0; j < res2.length; j++) {
                                                            if (res2[j].status == "ACCEPTED") {
                                                                let index;
                                                                for (let k = 0; k < jobs.declinedJobs.length; k++) {
                                                                    if (jobs.declinedJobs[k].jobId == res2[j].id && jobs.declinedJobs[k].workerId == res2[j].workerId) {
                                                                        index = k;
                                                                    }
                                                                }
                                                                if (index || index == 0) { }
                                                                else {
                                                                    // const postedDate = new Date(res2[j].postedDate);
                                                                    // const difference_ms = postedDate.getTime() - toDaysDate.getTime();
                                                                    // const days = Math.round(difference_ms / one_day);
                                                                    // if (days <= 1) {
                                                                    //     jobs.acceptedJobs.push(res2[j]);
                                                                    // }
                                                                    jobs.acceptedJobs.push(res2[j]);

                                                                }
                                                            }
                                                            else if (res2[j].status == "COMPLETED") {
                                                                jobs.completedJobs.push(res2[j]);
                                                            }
                                                            else if (res2[j].status == "PAYPENDING" || res2[j].status == "ONMYWAY" || res2[j].status == "JOBSTARTED" || res2[j].status == "FOLLOWEDUP") {
                                                                jobs.onGoingJobs.push(res2[j]);
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
                                                                    //jobs.upcomingJobs.push(res1[i]);
                                                                    let weekDay = getDay(new Date(res1[i].postedDate).getDay());
                                                                    let time = new Date(res1[i].postedDate).toLocaleString("en-US", { timeZone: data.timeZone }, { hour: 'numeric', minute: 'numeric', hour12: true });
                                                                    if (time) {
                                                                        time = time.split(', ')[1];
                                                                        if (time) {
                                                                            time = time.replace(":00", '');
                                                                            time = time.replace(":00", '');
                                                                            time = time.toLowerCase();
                                                                        }

                                                                    }

                                                                    //let time = new Date(res1[i].postedDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });


                                                                    // console.log("weekDay", weekDay);
                                                                    // console.log("time", time);
                                                                    // console.log("timingRes.length", timingRes.length);

                                                                    for (var w = 0; w < timingRes.length; w++) {
                                                                        if (timingRes[w].timings) {
                                                                            for (var v = 0; v < timingRes[w].timings.length; v++) {
                                                                                // console.log("timingRes[w].timings[v][weekDay", timingRes[w].timings[v][weekDay]);
                                                                                if (timingRes[w].timings[v][weekDay] == true) {
                                                                                    // console.log("time", time);
                                                                                    if (timingRes[w].timings[v].time == time) {
                                                                                        jobs.upcomingJobs.push(res1[i]);

                                                                                    }
                                                                                    //finalJobData.push(timingRes[w].timings[v].time);

                                                                                }
                                                                            }
                                                                        }

                                                                    }
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

                                                            if (res2[i].status == "ACCEPTED") {
                                                                // const postedDate = new Date(res2[i].postedDate);
                                                                // const difference_ms = postedDate.getTime() - toDaysDate.getTime();
                                                                // const days = Math.round(difference_ms / one_day);
                                                                // console.log("oneDay", days);
                                                                // if (days <= 1) {
                                                                //     jobs.acceptedJobs.push(res2[i]);
                                                                // }
                                                                jobs.acceptedJobs.push(res2[i]);

                                                            }
                                                            else if (res2[i].status == "ONMYWAY" || res2[i].status == "JOBSTARTED" || res2[i].status == "FOLLOWEDUP" || res2[i].status == "PAYPENDING") {
                                                                jobs.onGoingJobs.push(res2[i]);
                                                            }
                                                            else if (res2[i].status == "COMPLETED") {
                                                                jobs.completedJobs.push(res2[i]);
                                                            }
                                                        }
                                                        for (let i = 0; i < res1.length; i++) {
                                                            if (res1[i].status == "STARTED") {

                                                                let weekDay = getDay(new Date(res1[i].postedDate).getDay());
                                                                let time = new Date(res1[i].postedDate).toLocaleString("en-US", { timeZone: data.timeZone }, { hour: 'numeric', minute: 'numeric', hour12: true });
                                                                if (time) {
                                                                    time = time.split(', ')[1];
                                                                    if (time) {
                                                                        time = time.replace(":00", '');
                                                                        time = time.replace(":00", '');
                                                                        time = time.toLowerCase();
                                                                    }

                                                                }

                                                                //let time = new Date(res1[i].postedDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                                                                // time = time.replace(":00", '');
                                                                // time = time.toLowerCase();

                                                                for (var w = 0; w < timingRes.length; w++) {
                                                                    if (timingRes[w].timings) {
                                                                        for (var v = 0; v < timingRes[w].timings.length; v++) {
                                                                            if (timingRes[w].timings[v][weekDay] == true) {
                                                                                if (timingRes[w].timings[v].time == time) {
                                                                                    jobs.upcomingJobs.push(res1[i]);

                                                                                }
                                                                                //finalJobData.push(timingRes[w].timings[v].time);

                                                                            }
                                                                        }
                                                                    }

                                                                }
                                                                //jobs.upcomingJobs.push(res1[i]);

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

    Job.ignoreJob = function (data, cb) {
        var response = {};
        Job.app.models.declinedJobs.find({ where: { jobId: data.id, workerId: data.workerId } }, (findError, findSuccess) => {
            if (findError) {
                response.type = "Error";
                response.message = findError;
                cb(null, response);
            }
            else if (findSuccess.length > 0) {
                let message;
                if (data.language == "en") {
                    message = "You have already ignored this job.";
                }

                else if (data.language == "fr") {
                    message = "Vous avez déjà ignoré ce travail.";
                }
                else if (data.language == "ar") {
                    message = "لقد تجاهلت بالفعل هذه المهمة.";
                }
                response.type = "Error";
                response.message = message;
                cb(null, response);
            }
            else {
                var toInsertData = { "currencyId": data.currencyId, "jobId": data.id, workerId: data.workerId, "serviceId": data.serviceId, "status": "IGNORED", "reason": "" };
                Job.app.models.declinedJobs.create(toInsertData, (err, res) => {
                    if (err) {
                        response.type = "Error";
                        response.message = err;
                        cb(null, response);
                    }
                    else {
                        response.typ = "Success";
                        response.message = "You have successfully ignored the job.";
                        cb(null, response);
                    }


                })
            }
        })

    }

    Job.remoteMethod('ignoreJob', {
        http: {
            path: '/ignoreJob',
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
        const newDate = new Date();
        try {
            const postingTime = new Date(data.postingTime);
            const seconds = (newDate.getTime() - postingTime.getTime()) / 1000;
            const minutes = seconds / 60;
            if (minutes <= 5) {
                respone.type = "Success";
                respone.message = "0.0";
                cb(null, respone);
            }
            else {
                // const newDateUtc = newDate.toUTCString();
                // const newDateTime = new Date(newDateUtc).getTime();
                // const postedDateTime = new Date(data.postedDate).getTime();
                // let secondsDiff = (newDateTime - postedDateTime) / 1000;
                // let hoursDiff = secondsDiff / 3600;
                let hoursDiff = minutes / 60;
                let priceToCharge;
                data.price = Number(data.price);
                if (hoursDiff < 0) {
                    respone.type = "Success";
                    respone.message = "0.0";
                    cb(null, respone);
                }
                else if (hoursDiff > 24) {
                    respone.type = "Success";
                    respone.message = "0.0";
                    cb(null, respone);
                }
                else if (hoursDiff > 4 && hoursDiff < 24) {

                    priceToCharge = (50 * (data.price) / 100);
                    priceToCharge = priceToCharge.toFixed(2);
                    respone.type = "Success";
                    respone.message = priceToCharge;
                    cb(null, respone);
                }
                else if (hoursDiff < 4) {
                    priceToCharge = (50 * (data.price) / 100);
                    priceToCharge = priceToCharge.toFixed(2);
                    respone.type = "Success";
                    respone.message = priceToCharge;
                    cb(null, respone);
                }
            }
        } catch (error) {
            respone.type = "Error";
            respone.message = error;
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

    Job.recheduleJob = function (data, cb) {
        var response = {};
        try {
            let saveDbDay;
            const day = new Date(data.postedDate).getDay();
            switch (day) {
                case 0:
                    saveDbDay = "sun";
                    break;
                case 1:
                    saveDbDay = "mon";
                    break;
                case 2:
                    saveDbDay = "tue";
                    break;
                case 3:
                    saveDbDay = "wed";
                    break;
                case 4:
                    saveDbDay = "thu";
                    break;
                case 5:
                    saveDbDay = "fri";
                    break;
                case 6:
                    saveDbDay = "sat";
                    break;
                default:
                    break;
            }
            let saveDBTime;

            if (data.postedDate.includes('am')) {
                saveDBTime = data.postedDate.split(' ')[1].split(":")[0] + " am";
            }
            else if (data.postedDate.includes('pm')) {
                saveDBTime = data.postedDate.split(' ')[1].split(":")[0] + " pm";
            }
            if (saveDBTime.includes('0')) {
                saveDBTime = saveDBTime.replace('0', '');
            }
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
                                            if (res1[i].timings[j][saveDbDay] == true) {
                                                pushData.timings.push(res1[i].timings[j]);
                                            }
                                        }
                                    }
                                    availableDay.push(pushData);
                                }

                                for (var k = 0; k < availableDay.length; k++) {
                                    for (var m = 0; m < availableDay[k].timings.length; m++) {
                                        if (availableDay[k].timings[m].time == saveDBTime) {
                                            finalWorkerIds.push(availableDay[k].workerId);
                                        }
                                    }
                                }
                                var IsValid = true;
                                for (var n = 0; n < fullWokerList.length; n++) {

                                    if (finalWorkerIds.includes(fullWokerList[n].id)) {
                                        fullWokerList[n].IsAvailable = true;
                                        IsValid = true;
                                        break;
                                    }
                                    else {
                                        IsValid = false;
                                        fullWokerList[n].IsAvailable = false;
                                    }
                                }
                                if (IsValid) {
                                    Job.findById(data.id, (err1, res1) => {
                                        const postingTime = new Date();
                                        var toUpdateJobData = { priceToCharge: data.priceToCharge, id: res1.id, price: res1.price, postedDate: new Date(data.postedDate).toUTCString(), payment: res1.payment, faourite_sp: res1.faourite_sp, promo_code: res1.promo_code, status: res1.status, customerId: res1.customerId, currencyId: res1.currencyId, workerId: res1.workerId, zoneId: res1.zoneId, serviceId: res1.serviceId, userLocationId: res1.userLocationId, postingTime: postingTime, prevPostedDate: res1.postedDate, IsRescheduled: true };

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
                                                                    let title; let body;
                                                                    if (res2.language) {
                                                                        if (res2.language == "en") {
                                                                            title = "Your job has been rescheduled.";
                                                                            body = "Please start the job on the new date.";
                                                                        }
                                                                        else if (res2.language == "ar") {
                                                                            title = "تم جدولة وظيفتك.";
                                                                            body = "يرجى بدء المهمة في التاريخ الجديد.";
                                                                        }
                                                                        else if (res2.language == "fr") {
                                                                            title = "Votre travail a été reporté.";
                                                                            body = "Veuillez démarrer le travail à la nouvelle date.";
                                                                        }
                                                                    }
                                                                    else {
                                                                        title = "Your job has been rescheduled.";
                                                                        body = "Please start the job on the new date.";
                                                                    }
                                                                    var message = {
                                                                        to: res2.deviceToken,
                                                                        data: {
                                                                            "screenType": "JobDetails",
                                                                            "jobId": data.id
                                                                        },
                                                                        notification: {
                                                                            title: title,
                                                                            body: body
                                                                        }
                                                                    };
                                                                    const notificationInsertData = { notificationType: "ResJob", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: res1.workerId, jobId: res1.id, IsToWorker: true, IsRead: 0 };
                                                                    Job.app.models.Notifications.create(notificationInsertData, (notError, notSuccess) => {
                                                                        if (notError) {
                                                                            response.type = "error";
                                                                            response.message = notError;
                                                                            cb(null, response);
                                                                        }
                                                                        else {
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
                                                                    })

                                                                }

                                                            }
                                                        })
                                                    }


                                                }
                                            })
                                        }




                                    })
                                }
                                else {
                                    response.type = "Error";
                                    response.message = "Please change your timing as no workers are available.";
                                    cb(null, response);
                                }



                            }

                            else {
                                response.type = "Error";
                                response.message = "Please change your timing as no workers are available.";
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

        } catch (error) {
            response.type = "Error";
            response.message = error;
            cb(null, response);

        }

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
    });
    Job.acceptJob = function (data, cb) {
        var response = {};
        Job.findById(data.id, (findError, findSuccess) => {
            if (findError) {
                response.type = "Error";
                response.message = findError;
                cb(null, response);
            }
            else {
                // console.log("findSuccess", findSuccess);
                if (findSuccess.status == "ACCEPTED") {
                    if (findSuccess.workerId == data.workerId) {
                        let message;
                        if (data.language == "en") {
                            message = "You have already accepted this job.";
                        }
                        else if (data.language == "fr") {
                            message = "Vous avez déjà accepté ce travail.";
                        }
                        else if (data.language == "ar") {
                            message = "لقد قبلت هذه الوظيفة بالفعل.";
                        }
                        response.type = "Error";
                        response.message = message;
                        cb(null, response);
                    }
                    else {
                        let message;
                        if (data.language == "en") {
                            message = "This job is already accepted.";
                        }
                        else if (data.language == "fr") {
                            message = "Ce travail est déjà accepté.";
                        }
                        else if (data.language == "ar") {
                            message = "هذه الوظيفة مقبولة بالفعل.";
                        }
                        response.type = "Error";
                        response.message = message;
                        cb(null, response);
                    }
                }
                else {
                    Job.find({ where: { workerId: data.workerId, status: 'ACCEPTED' } }, (timeError, timeSuccess) => {
                        if (timeError) {
                            response.type = "Error";
                            response.message = timeError;
                            cb(null, response);
                        }
                        else {
                            const toAcceptJobPostingDate1 = new Date(findSuccess.postedDate);
                            const toAcceptJobPostingDate = toAcceptJobPostingDate1.getDate() + "/" + toAcceptJobPostingDate1.getMonth() + "/" + toAcceptJobPostingDate1.getFullYear();
                            let toAcceptDateWithAddedTime = new Date(findSuccess.postedDate);
                            toAcceptDateWithAddedTime.setMinutes(toAcceptDateWithAddedTime.getMinutes() + findSuccess.expectedTimeInterval);
                            if (timeSuccess.length > 0) {
                                for (let i = 0; i < timeSuccess.length; i++) {
                                    const toCompareDate1 = new Date(timeSuccess[i].postedDate);
                                    let toCompareDateWithAddedTime = new Date(timeSuccess[i].postedDate);
                                    toCompareDateWithAddedTime.setMinutes(toCompareDate1.getMinutes() + timeSuccess[i].expectedTimeInterval);
                                    const toCompareDate = toCompareDate1.getDate() + "/" + toCompareDate1.getMonth() + "/" + toCompareDate1.getFullYear();
                                    console.log("toCompareDate", toCompareDate1.toUTCString());
                                    console.log("toCompareDateWithAddedTime", toCompareDateWithAddedTime.toUTCString());
                                    if (toCompareDate == toAcceptJobPostingDate) {
                                        if ((toAcceptJobPostingDate1.getTime() <= toCompareDateWithAddedTime && toAcceptJobPostingDate1.getTime() >= toCompareDate1.getTime())) {
                                            response.type = "Error";
                                            response.message = "You have already accepted a job in that interval.";
                                            cb(null, response);
                                        }
                                        else if (toCompareDate1.getTime() <= toAcceptDateWithAddedTime && toCompareDate1.getTime() >= toAcceptJobPostingDate1.getTime()) {
                                            response.type = "Error";
                                            response.message = "You have already accepted a job in that interval.";
                                            cb(null, response);
                                        }
                                        else {
                                            Job.upsert(data, (jobUpdateError, JobUpdateRes) => {
                                                if (jobUpdateError) {
                                                    response.type = "Error";
                                                    response.message = jobUpdateError;
                                                    cb(null, response);
                                                }
                                                else {
                                                    let toInsertData = { jobId: data.id, status: data.status, statusChangeddate: new Date().toUTCString(), is_active: 1 };
                                                    Job.app.models.jobTrackerStatus.create(toInsertData, (finalError, finalSuccess) => {
                                                        if (finalError) {
                                                            response.type = "Error";
                                                            response.message = finalError;
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
                                                                        let title; let body;
                                                                        if (res1.language) {
                                                                            if (res1.language == "en") {
                                                                                title = "Your Job is being accepted.";
                                                                                body = "See the job details for service provider details.";
                                                                            }
                                                                            else if (res1.language == "ar") {
                                                                                title = "يتم قبول وظيفتك.";
                                                                                body = "انظر تفاصيل الوظيفة لمعرفة تفاصيل مقدم الخدمة.";
                                                                            }
                                                                            else if (res1.language == "fr") {
                                                                                title = "Votre travail est accepté.";
                                                                                body = "Voir les détails du travail pour les détails du fournisseur de services.";
                                                                            }

                                                                        }
                                                                        else {
                                                                            title = "Your Job is being accepted.";
                                                                            body = "Ple see the job details for service provider details.";
                                                                        }
                                                                        var message = {
                                                                            to: res1.deviceToken,
                                                                            data: {
                                                                                "screenType": "JobDetails",
                                                                                "jobId": data.id
                                                                            },
                                                                            notification: {
                                                                                title: title,
                                                                                body: body
                                                                            }
                                                                        };
                                                                        const notificationInsertData = { notificationType: "JobAccepted", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.customerId, jobId: data.id, IsToWorker: false, IsRead: 0 };
                                                                        Job.app.models.Notifications.create(notificationInsertData, (finalError, finalSuccess) => {
                                                                            if (finalError) {
                                                                                fcm1.send(message, function (err4, fcmResponse) {
                                                                                    if (err4) {
                                                                                        response.type = "success";
                                                                                        response.message = "Job accepted successfully.";
                                                                                        cb(null, response);
                                                                                    } else {
                                                                                        response.type = "success";
                                                                                        response.message = "Job accepted successfully.";
                                                                                        cb(null, response);
                                                                                    }
                                                                                });
                                                                            }
                                                                            else {
                                                                                fcm1.send(message, function (err4, fcmResponse) {
                                                                                    if (err4) {
                                                                                        response.type = "success";
                                                                                        response.message = "Job accepted successfully.";
                                                                                        cb(null, response);
                                                                                    } else {
                                                                                        response.type = "success";
                                                                                        response.message = "Job accepted successfully.";
                                                                                        cb(null, response);
                                                                                    }
                                                                                });
                                                                            }
                                                                        })

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
                                            })

                                        }
                                    }
                                    else {
                                        Job.upsert(data, (jobUpdateError2, JobUpdateSuccess2) => {
                                            if (jobUpdateError2) {
                                                response.type = "Error";
                                                response.message = jobUpdateError2;
                                                cb(null, response);
                                            }
                                            else {
                                                let toInsertData = { jobId: data.id, status: data.status, statusChangeddate: new Date().toUTCString(), is_active: 1 };
                                                Job.app.models.jobTrackerStatus.create(toInsertData, (finalError, finalSuccess) => {
                                                    if (finalError) {
                                                        response.type = "Error";
                                                        response.message = finalError;
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
                                                                    let title; let body;
                                                                    if (res1.language) {
                                                                        if (res1.language == "en") {
                                                                            title = "Your Job is being accepted.";
                                                                            body = "See the job details for service provider details.";
                                                                        }
                                                                        else if (res1.language == "ar") {
                                                                            title = "يتم قبول وظيفتك.";
                                                                            body = "انظر تفاصيل الوظيفة لمعرفة تفاصيل مقدم الخدمة.";
                                                                        }
                                                                        else if (res1.language == "fr") {
                                                                            title = "Votre travail est accepté.";
                                                                            body = "Voir les détails du travail pour les détails du fournisseur de services.";
                                                                        }

                                                                    }
                                                                    else {
                                                                        title = "Your Job is being accepted.";
                                                                        body = "Ple see the job details for service provider details.";
                                                                    }
                                                                    var message = {
                                                                        to: res1.deviceToken,
                                                                        data: {
                                                                            "screenType": "JobDetails",
                                                                            "jobId": data.id
                                                                        },
                                                                        notification: {
                                                                            title: title,
                                                                            body: body
                                                                        }
                                                                    };
                                                                    const notificationInsertData = { notificationType: "JobAccepted", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.customerId, jobId: data.id, IsToWorker: false, IsRead: 0 };
                                                                    Job.app.models.Notifications.create(notificationInsertData, (finalError, finalSuccess) => {
                                                                        if (finalError) {
                                                                            fcm1.send(message, function (err4, fcmResponse) {
                                                                                if (err4) {
                                                                                    response.type = "success";
                                                                                    response.message = "Job accepted successfully.";
                                                                                    cb(null, response);
                                                                                } else {
                                                                                    response.type = "success";
                                                                                    response.message = "Job accepted successfully.";
                                                                                    cb(null, response);
                                                                                }
                                                                            });
                                                                        }
                                                                        else {
                                                                            fcm1.send(message, function (err4, fcmResponse) {
                                                                                if (err4) {
                                                                                    response.type = "success";
                                                                                    response.message = "Job accepted successfully.";
                                                                                    cb(null, response);
                                                                                } else {
                                                                                    response.type = "success";
                                                                                    response.message = "Job accepted successfully.";
                                                                                    cb(null, response);
                                                                                }
                                                                            });
                                                                        }
                                                                    })

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
                                        })

                                    }
                                }
                            }
                            else {
                                Job.upsert(data, (jobUpdateErr, jobUpdateSuccess) => {
                                    if (jobUpdateErr) {
                                        response.type = "Error";
                                        response.message = jobUpdateErr;
                                        cb(null, response);
                                    }
                                    else {
                                        let toInsertData = { jobId: data.id, status: data.status, statusChangeddate: new Date().toUTCString(), is_active: 1 };
                                        Job.app.models.jobTrackerStatus.create(toInsertData, (finalError, finalSuccess) => {
                                            if (finalError) {
                                                response.type = "Error";
                                                response.message = finalError;
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
                                                            let title; let body;
                                                            if (res1.language) {
                                                                if (res1.language == "en") {
                                                                    title = "Your Job is being accepted.";
                                                                    body = "See the job details for service provider details.";
                                                                }
                                                                else if (res1.language == "ar") {
                                                                    title = "يتم قبول وظيفتك.";
                                                                    body = "انظر تفاصيل الوظيفة لمعرفة تفاصيل مقدم الخدمة.";
                                                                }
                                                                else if (res1.language == "fr") {
                                                                    title = "Votre travail est accepté.";
                                                                    body = "Voir les détails du travail pour les détails du fournisseur de services.";
                                                                }

                                                            }
                                                            else {
                                                                title = "Your Job is being accepted.";
                                                                body = "Ple see the job details for service provider details.";
                                                            }
                                                            var message = {
                                                                to: res1.deviceToken,
                                                                data: {
                                                                    "screenType": "JobDetails",
                                                                    "jobId": data.id
                                                                },
                                                                notification: {
                                                                    title: title,
                                                                    body: body
                                                                }
                                                            };
                                                            const notificationInsertData = { notificationType: "JobAccepted", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.customerId, jobId: data.id, IsToWorker: false, IsRead: 0 };
                                                            Job.app.models.Notifications.create(notificationInsertData, (finalError, finalSuccess) => {
                                                                if (finalError) {
                                                                    fcm1.send(message, function (err4, fcmResponse) {
                                                                        if (err4) {
                                                                            response.type = "success";
                                                                            response.message = "Job accepted successfully.";
                                                                            cb(null, response);
                                                                        } else {
                                                                            response.type = "success";
                                                                            response.message = "Job accepted successfully.";
                                                                            cb(null, response);
                                                                        }
                                                                    });
                                                                }
                                                                else {
                                                                    fcm1.send(message, function (err4, fcmResponse) {
                                                                        if (err4) {
                                                                            response.type = "success";
                                                                            response.message = "Job accepted successfully.";
                                                                            cb(null, response);
                                                                        } else {
                                                                            response.type = "success";
                                                                            response.message = "Job accepted successfully.";
                                                                            cb(null, response);
                                                                        }
                                                                    });
                                                                }
                                                            })

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
                                })

                            }

                        }
                    });

                }
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
        console.log("data", data);
        var respone = {};
        var response = {};
        Job.app.models.jobTrackerStatus.find({ jobId: data.id }, (finalError, finalSuccess) => {
            if (finalError) {
                response.type = "Error";
                response.message = finalError;
                cb(null, response);
            }
            else {
                console.log("finalSuccess", finalSuccess.length);
                if (finalSuccess.length > 0) {
                    console.log("success");
                    let toInsertData = { jobId: data.id, status: data.status, statusChangeddate: new Date().toUTCString(), is_active: 1 };
                    console.log("toInsertData", toInsertData);
                    Job.app.models.jobTrackerStatus.create(toInsertData, (finalError2, finalSuccess2) => {
                        if (finalError2) {
                            response.type = "Error";
                            response.message = finalError2;
                            cb(null, response);
                        }
                        else {
                            console.log("updatingJob")
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
                                                let title; let body;
                                                if (res1.language) {
                                                    if (res1.language == "en") {
                                                        if (data.status == 'ONMYWAY') {
                                                            title = "The worker is on the way.";
                                                            body = "The job will start shortly.";
                                                        }
                                                        else {
                                                            title = "The worker has started the job.";
                                                            body = "You will be notified once job is completed.";
                                                        }

                                                    }
                                                    else if (res1.language == "ar") {
                                                        if (data.status == "ONMYWAY") {
                                                            title = "العامل على الطريق.";
                                                            body = "سوف تبدأ المهمة قريبا.";
                                                        }
                                                        else {
                                                            title = "بدأ العامل العمل.";
                                                            body = "سيتم إعلامك بمجرد الانتهاء من المهمة.";
                                                        }

                                                    }
                                                    else if (res1.language == "fr") {
                                                        if (data.status == "ONMYWAY") {
                                                            title = "Le travailleur est en route.";
                                                            body = "Le travail commencera bientôt.";
                                                        }
                                                        else {
                                                            title = "Le travailleur a commencé le travail.";
                                                            body = "Vous serez averti une fois le travail terminé.";
                                                        }

                                                    }
                                                }
                                                else {
                                                    if (data.status == 'ONMYWAY') {
                                                        title = "The worker is on the way.";
                                                        body = "The job will start shortly.";
                                                    }
                                                    else {
                                                        title = "The worker has started the job.";
                                                        body = "You will be notified once job is completed.";
                                                    }

                                                }

                                                var message = {
                                                    to: res1.deviceToken,
                                                    data: {
                                                        "screenType": "JobDetails",
                                                        "jobId": data.id
                                                    },
                                                    notification: {
                                                        title: title,
                                                        body: body
                                                    }
                                                };

                                                let notificationInsertData = { notificationType: data.status, notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.customerId, jobId: data.id, IsToWorker: false, IsRead: 0 };
                                                if (data.status != 'ONMYWAY') {
                                                    const dataToInsert = { jobId: data.id, startTime: data.startTime, endTime: data.endTime };
                                                    Job.app.models.jobstartTime.remove({ jobId: data.id }, (finalError8, successError8) => {
                                                        if (finalError8) {

                                                        }
                                                        else {
                                                            Job.app.models.jobstartTime.upsert(dataToInsert, (err5, res5) => {
                                                                if (err5) {
                                                                    response.type = "error";
                                                                    response.message = err5;
                                                                    cb(null, response);
                                                                }
                                                                else {
                                                                    Job.app.models.Notifications.create(notificationInsertData, (err8, success8) => {
                                                                        if (err8) {
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
                                                                    });

                                                                }
                                                            })
                                                        }
                                                    })

                                                }
                                                else {

                                                    Job.app.models.Notifications.create(notificationInsertData, (err9, success9) => {
                                                        if (err9) {
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
                    })


                }
                else {

                    let toInsertData = { jobId: data.id, status: data.status, statusChangeddate: new Date().toUTCString(), is_active: 1 };
                    Job.app.models.jobTrackerStatus.create(toInsertData, (finalError2, finalSuccess2) => {
                        if (finalError2) {
                            response.type = "Error";
                            response.message = finalError2;
                            cb(null, response);
                        }
                        else {
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
                                                let notificationInsertData = { notificationType: data.status, notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.customerId, jobId: data.id, IsToWorker: false, IsRead: 0 };
                                                if (data.status != 'ONMYWAY') {
                                                    const dataToInsert = { jobId: data.id, startTime: data.startTime, endTime: data.endTime };
                                                    Job.app.models.jobstartTime.remove({ jobId: data.id }, (finalError5, successFinal) => {
                                                        if (finalError5) {

                                                        }
                                                        else {
                                                            Job.app.models.jobstartTime.upsert(dataToInsert, (err5, res5) => {
                                                                if (err5) {
                                                                    response.type = "error";
                                                                    response.message = err5;
                                                                    cb(null, response);
                                                                }
                                                                else {
                                                                    Job.app.models.Notifications.create(notificationInsertData, (notError, notSuccess) => {
                                                                        if (notError) {
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
                                                            })
                                                        }
                                                    })

                                                }
                                                else {
                                                    Job.app.models.Notifications.create(notificationInsertData, (notErro1, notSuccess1) => {
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
                                                    })

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
                    })
                }
            }
        });

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
                        const toUpdata = { id: data.jobId, status: 'STARTED' };
                        Job.upsert(toUpdata, (updateError, updateSuccess) => {
                            if (updateError) {
                                response.type = "Error";
                                response.message = updateError;
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
                                                let title; let body;
                                                if (res2[0].language) {
                                                    if (res2[0].language == "en") {
                                                        title = "Your Job is cancelled.";
                                                        body = "Its opened for other service providers.";
                                                    }
                                                    else if (res2[0].language == "ar") {
                                                        title = "تم إلغاء وظيفتك.";
                                                        body = "فتحت لمقدمي الخدمات الآخرين.";
                                                    }
                                                    if (res2[0].language == "fr") {
                                                        title = "Votre travail est annulé.";
                                                        body = "Son ouvert pour d'autres fournisseurs de services.";
                                                    }

                                                }
                                                else {
                                                    title = "Your Job is cancelled.";
                                                    body = "Its opened for other service providers.";
                                                }
                                                var message = {
                                                    to: res2[0].deviceToken,
                                                    data: {
                                                        "screenType": "MyJobs",
                                                        "jobId": data.jobId
                                                    },
                                                    notification: {
                                                        title: title,
                                                        body: body
                                                    }
                                                };
                                                const notificationInsertData = { notificationType: "JobCancel", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: res1.customerId, jobId: data.jobId, IsToWorker: false };
                                                Job.app.models.Notifications.create(notificationInsertData, (notError, notSuccess) => {
                                                    if (notError) {
                                                        response.type = "Error";
                                                        response.message = notError;
                                                        cb(null, response);
                                                    }
                                                    else {
                                                        fcm.send(message, function (err4, fcmResponse) {
                                                            if (err4) {
                                                                response.type = "success";
                                                                response.message = "Job cancelled successfully.";
                                                                cb(null, response);
                                                            } else {
                                                                response.type = "success";
                                                                response.message = "Job cancelled successfully.";
                                                                cb(null, response);
                                                            }
                                                        });
                                                    }
                                                });

                                            }
                                            else {
                                                response.type = "success";
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

    Job.cancelllationPriceCalculate = function (data, cb) {
        var response = {};
        try {
            const postingTime = new Date(data.postingTime);
            const newDate = new Date();
            const seconds = (newDate.getTime() - postingTime.getTime()) / 1000;
            const minutes = seconds / 60;
            console.log("postingTime", postingTime);
            console.log("newDate", newDate);
            console.log("minutes", minutes);
            if (minutes <= 5) {
                response.type = "Success";
                response.IsCancellationPrice = false;
                response.price = "0.0";
                cb(null, response);
            }
            else {
                Job.findById(data.id, (error1, res1) => {
                    if (error1) {
                        response.type = "Error";
                        response.message = error1;
                        cb(null, response);
                    }
                    else {
                        if (res1) {
                            // const newDateUtc = newDate.toUTCString();
                            // const newDateTime = new Date(newDateUtc).getTime();
                            // const postedDateTime = new Date(res1.postingTime).getTime();
                            // let secondsDiff = (newDateTime - postedDateTime) / 1000;
                            // let hoursDiff = secondsDiff / 3600;
                            let hoursDiff=minutes/60;
                            console.log("hoursDiff", hoursDiff);
                            let priceToCharge;
                            data.price = Number(data.price);
                            if (hoursDiff < 0) {
                                priceToCharge = "0.0";
                            }
                            else if (hoursDiff > 24) {
                                priceToCharge = "0.0";
                            }
                            else if (hoursDiff > 4 && hoursDiff < 24) {
                                priceToCharge = (50 * (data.price) / 100);
                                priceToCharge = priceToCharge.toFixed(2);
                            }
                            else if (hoursDiff < 4) {
                                priceToCharge = (50 * (data.price) / 100);
                                priceToCharge = priceToCharge.toFixed(2);
                            }
                            response.type = "Success";
                            response.IsCancellationPrice = false;
                            response.price = parseFloat(priceToCharge).toFixed(2);
                            cb(null, response);
                        }
                        else {
                            response.type = "Error";
                            response.message = "No job found.";
                            cb(null, response);
                        }

                    }
                })

            }

        } catch (error) {
            response.type = "Error";
            response.message = error;
            cb(null, response);
        }
    }

    Job.remoteMethod('cancelllationPriceCalculate', {
        http: {
            path: '/cancelllationPriceCalculate',
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
        Job.findById(data.id, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                const toUpdateJob = { id: data.id, status: 'CANCELLED', price: data.price };
                Job.upsert(toUpdateJob, (err1, res1) => {
                    if (err1) {
                        response.type = "Error";
                        response.message = err1;
                        cb(null, response);
                    }
                    else {
                        if (res && res.status == "ACCEPTED") {
                            Job.app.models.Worker.findById(res.workerId, (err2, res2) => {
                                if (err) {
                                    response.type = "Success";
                                    response.message = "Job Cancelled Successfully but colud'nt inform worker.";
                                    cb(null, response);
                                }
                                else {
                                    if (res2 && res2.deviceToken) {
                                        let title; let body;
                                        if (res2.language) {
                                            if (res2.language == "en") {
                                                title = "You job has been cancelled.";
                                                body = "Contact Admin for details."
                                            }
                                            else if (res2.language == "ar") {
                                                title = "تم إلغاء وظيفتك.";
                                                body = "اتصل بالمسؤول للحصول على التفاصيل."
                                            }
                                            else if (res2.language == "fr") {
                                                title = "Votre travail a été annulé.";
                                                body = "Contactez l'administrateur pour plus de détails."
                                            }
                                        }
                                        else {
                                            title = "You job has been cancelled.";
                                            body = "Contact Admin for details."
                                        }
                                        var message = {
                                            to: res2.deviceToken,
                                            data: {
                                                "screenType": "AvailableJobs",
                                                "jobId": data.id
                                            },
                                            notification: {
                                                title: title,
                                                body: body
                                            }
                                        };
                                        const notificationInsertData = { notificationType: "JobCancel", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: res.workerId, jobId: data.id, IsToWorker: true };
                                        Job.app.models.Notifications.create(notificationInsertData, (notError, notSuccess) => {
                                            if (notError) {
                                                response.type = "Error";
                                                response.message = notError;
                                                cb(null, response);
                                            }
                                            else {
                                                fcm.send(message, function (err, fcmResponse) {
                                                    if (err) {
                                                        response.type = "Success";
                                                        response.message = "Job has been cancelled successfully.";
                                                        cb(null, response);
                                                    } else {
                                                        response.type = "Success";
                                                        response.message = "Job has been cancelled successfully.";
                                                        cb(null, response);
                                                    }
                                                });
                                            }
                                        })
                                    }
                                    else {
                                        response.type = "Success";
                                        response.message = "Job Cancelled Successfully but colud'nt inform worker.";
                                        cb(null, response);
                                    }

                                }
                            })
                        }
                        else {
                            response.type = "Success";
                            response.message = "Job Cancelled Successfully.";
                            cb(null, response);
                        }
                    }
                })
            }
        })
        // try {
        //     const postingTime = new Date(data.postingTime);
        //     const newDate = new Date();
        //     const seconds = (newDate.getTime() - postingTime.getTime()) / 1000;
        //     const minutes = seconds / 60;
        //     Job.findById(data.id, (err1, res1) => {
        //         if (minutes <= 5) {


        //             if (err1) {
        //                 response.type = "Error";
        //                 response.message = err1;
        //                 cb(null, response);
        //             }
        //             else {
        //                 var toUpdateData = { id: data.id, status: data.status };
        //                 Job.upsert(toUpdateData, (err, res) => {
        //                     if (err) {
        //                         response.type = "Error";
        //                         response.message = err;
        //                         cb(null, response);
        //                     }
        //                     else {
        //                         toUpdateData = { jobId: data.id, workerId: "0", serviceId: res1.serviceId, status: "CANCELLED", reason: data.reason };
        //                         Job.app.models.declinedJobs.upsert(toUpdateData, (errorRes, finalRes) => {
        //                             if (errorRes) {
        //                                 response.type = "Error";
        //                                 response.message = errorRes;
        //                                 cb(null, response);
        //                             }
        //                             else {
        //                                 if (res1.status == "STARTED") {
        //                                     response.type = "SUCCESS";
        //                                     response.message = "Job successfully cancelled with ZERO cancellation fee.";
        //                                     cb(null, response);
        //                                 }
        //                                 else if (res1.status == "ACCEPTED") {
        //                                     Job.app.models.Worker.findById(res1.workerId, (err2, res2) => {
        //                                         if (err2) {
        //                                             response.type = "Error";
        //                                             response.message = err2;
        //                                             cb(null, response);
        //                                         }
        //                                         else {
        //                                             if (res2.deviceToken) {
        //                                                 let title; let body;
        //                                                 if (res2.language) {
        //                                                     if (res2.language == "en") {
        //                                                         title = "You job has been cancelled.";
        //                                                         body = "Contact Admin for details."
        //                                                     }
        //                                                     else if (res2.language == "ar") {
        //                                                         title = "تم إلغاء وظيفتك.";
        //                                                         body = "اتصل بالمسؤول للحصول على التفاصيل."
        //                                                     }
        //                                                     else if (res2.language == "fr") {
        //                                                         title = "Votre travail a été annulé.";
        //                                                         body = "Contactez l'administrateur pour plus de détails."
        //                                                     }
        //                                                 }
        //                                                 else {
        //                                                     title = "You job has been cancelled.";
        //                                                     body = "Contact Admin for details."
        //                                                 }
        //                                                 var message = {
        //                                                     to: res2.deviceToken,
        //                                                     data: {
        //                                                         "screenType": "AvailableJobs",
        //                                                         "jobId": data.id
        //                                                     },
        //                                                     notification: {
        //                                                         title: title,
        //                                                         body: body
        //                                                     }
        //                                                 };
        //                                                 const notificationInsertData = { notificationType: "JobCancel", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: res1.workerId, jobId: data.id, IsToWorker: true };
        //                                                 Job.app.models.Notifications.create(notificationInsertData, (notError, notSuccess) => {
        //                                                     if (notError) {
        //                                                         response.type = "error";
        //                                                         response.message = notError;
        //                                                         cb(null, response);
        //                                                     }
        //                                                     else {
        //                                                         fcm.send(message, function (err, fcmResponse) {
        //                                                             if (err) {
        //                                                                 response.type = "success";
        //                                                                 response.message = "Job has been cancelled successfully.";
        //                                                                 cb(null, response);
        //                                                             } else {
        //                                                                 response.type = "success";
        //                                                                 response.message = "Job has been cancelled successfully.";
        //                                                                 cb(null, response);
        //                                                             }
        //                                                         });
        //                                                     }
        //                                                 })

        //                                             }

        //                                         }
        //                                     })
        //                                 }
        //                             }
        //                         })

        //                     }
        //                 })
        //             }


        //         }
        //         else {
        //             const newDateUtc = newDate.toUTCString();
        //             const newDateTime = new Date(newDateUtc).getTime();
        //             const postedDateTime = new Date(res1.postedDate).getTime();
        //             let secondsDiff = (newDateTime - postedDateTime) / 1000;
        //             let hoursDiff = secondsDiff / 3600;
        //             let priceToCharge;
        //             data.price = Number(data.price);
        //             if (hoursDiff < 0) {
        //                 priceToCharge = "0.0";
        //             }
        //             else if (hoursDiff > 24) {
        //                 priceToCharge = "0.0";
        //             }
        //             else if (hoursDiff > 4 && hoursDiff < 24) {
        //                 priceToCharge = priceToCharge;
        //             }
        //             else if (hoursDiff < 4) {
        //                 priceToCharge = priceToCharge;
        //             }

        //             var toUpdateData1 = { id: data.id, status: data.status, priceToCharge: priceToCharge };
        //             Job.upsert(toUpdateData1, (err, res) => {
        //                 if (err) {
        //                     response.type = "Error";
        //                     response.message = err;
        //                     cb(null, response);
        //                 }
        //                 else {
        //                     toUpdateData1 = { jobId: data.id, workerId: "0", serviceId: res1.serviceId, status: "CANCELLED", reason: data.reason };
        //                     Job.app.models.declinedJobs.upsert(toUpdateData1, (fianlError, finalRes) => {
        //                         if (fianlError) {
        //                             response.type = "Error";
        //                             response.message = fianlError;
        //                             cb(null, response);
        //                         }
        //                         else {
        //                             if (res1.status == "STARTED") {
        //                                 response.type = "SUCCESS";
        //                                 response.message = "Job successfully cancelled with ZERO cancellation fee.";
        //                                 cb(null, response);
        //                             }
        //                             else if (res1.status == "ACCEPTED") {

        //                                 Job.app.models.Worker.findById(res1.workerId, (err2, res2) => {
        //                                     if (err2) {
        //                                         response.type = "Error";
        //                                         response.message = err2;
        //                                         cb(null, response);
        //                                     }
        //                                     else {

        //                                         if (res2.deviceToken) {
        //                                             var message = {
        //                                                 to: res2.deviceToken,
        //                                                 data: {
        //                                                     "screenType": "AvailableJobs"
        //                                                 },
        //                                                 notification: {
        //                                                     title: "You job has been cancelled.",
        //                                                     body: "You job has been cancelled."
        //                                                 }
        //                                             };
        //                                             fcm.send(message, function (err, fcmResponse) {
        //                                                 if (err) {
        //                                                     response.type = "error";
        //                                                     response.message = err;
        //                                                     cb(null, response);
        //                                                 } else {
        //                                                     response.type = "SUCCESS";
        //                                                     response.message = "Job has been cancelled successfully.";
        //                                                     cb(null, response);
        //                                                 }
        //                                             });
        //                                         }

        //                                     }
        //                                 })
        //                             }
        //                         }
        //                     })

        //                 }
        //             })
        //         }
        //     })
        // } catch (error) {
        //     response.type = "Error";
        //     response.message = error;
        //     cb(null, response);
        // }



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
        Job.find({ include: ["customer", "worker", "service", "currency", "zone"] }, (err, res) => {
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
            Job.find({ where: { customerId: data.customerId, status: { nin: ['CLOSED'] } }, include: ["service", "userLocation", "worker", "currency"], "order": "id DESC" }, (err, res) => {
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
        else if (data.status == "ACCEPTED" || data.status == "FOLLOWEDUP" || data.status == "COMPLETED" || data.status == "STARTED" || data.status == "ONMYWAY" || data.status == "JOBSTARTED" || data.status == "PAYPENDING") {
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
                        Job.find({ "where": { "or": finalJobIds }, include: ["service", "userLocation", "worker", "currency"], "order": "id DESC" }, (err1, res1) => {
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
        console.log("hello", data);
        const requestData = data;
        if (data.status == 'PAYPENDING') {
            Job.app.models.Customer.findById(data.customerId, (err1, res1) => {
                if (err1) {
                    response.type = "Error";
                    response.message = err1;
                    cb(null, response);
                }
                else {
                    console.log("pragati", data);
                    if (res1.deviceToken) {
                        let title; let body;
                        if (data.language == "en") {
                            title = "Your job is completed.";
                            body = "Thank  you for choosing for the service."
                        }
                        else if (data.language == "ar") {
                            title = "اكتملت وظيفتك.";
                            body = "شكرا لاختيارك للخدمة."
                        }
                        else if (data.language == "fr") {
                            title = "Votre travail est terminé.";
                            body = "Merci d'avoir choisi pour le service."
                        }
                        var message = {
                            to: res1.deviceToken,
                            data: {
                                "screenType": "JobDetails",
                                "jobId": data.id
                            },
                            notification: {
                                title: title,
                                body: body
                            }
                        };
                        let notificationInsertData = { notificationType: data.status, notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.customerId, jobId: data.id, IsToWorker: false, IsRead: 0 };
                        Job.app.models.Notifications.create(notificationInsertData, (notError, notSuccess) => {
                            fcm.send(message, function (err, fcmResponse) {
                                if (err) {
                                    response.type = "error";
                                    response.message = err;
                                    cb(null, response);
                                } else {
                                    console.log("hello2")
                                    Job.app.models.Service.findById(data.serviceId, (err2, res2) => {
                                        if (err2) {
                                            response.type = "Error";
                                            response.message = err2;
                                            cb(null, response);
                                        }
                                        else {
                                            var definedTime = res2.time_interval;
                                            var actualTime = Number(requestData.actualTime);
                                            var price;
                                            if (actualTime == res2.time_interval) {
                                                price = requestData.price;
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
                                            const data4 = { status: requestData.status, id: requestData.id, price: price };
                                            console.log("price", price);
                                            Job.upsert(data4, (jobError, jobSuccess) => {
                                                Job.app.models.jobTrackerStatus.update({ jobId: requestData.id, is_active: 0 }, (statusError, statusSuccess) => {
                                                    if (statusError) {
                                                        response.type = "Error";
                                                        response.message = "Error in updating job status.";
                                                        response.price = price;
                                                        cb(null, response);
                                                    }
                                                    else {
                                                        let toInsertData = { jobId: requestData.id, status: requestData.status, statusChangeddate: new Date().toUTCString(), is_active: 1 };
                                                        Job.app.models.jobTrackerStatus.create(toInsertData, (finalError, finalSuccess) => {
                                                            response.type = "Success";
                                                            response.message = "Job Completed.";
                                                            response.price = price;
                                                            cb(null, response);
                                                        })
                                                    }
                                                })
                                            })



                                        }
                                    })

                                }
                            });
                        })

                    }
                    else {
                        console.log("hello3")
                        Job.app.models.Service.findById(requestData.serviceId, (err2, res2) => {
                            if (err2) {
                                response.type = "Error";
                                response.message = err2;
                                cb(null, response);
                            }
                            else {
                                var definedTime = res2.time_interval;
                                var actualTime = Number(requestData.actualTime);
                                var price;
                                if (actualTime == res2.time_interval) {
                                    price = requestData.price;
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
                                const data8 = { status: requestData.status, id: requestData.id, price: price };
                                console.log("price", price);
                                Job.upsert(data8, (jobError, jobSuccess) => {
                                    Job.app.models.jobTrackerStatus.update({ jobId: requestData.id, is_active: 0 }, (statusError, statusSuccess) => {
                                        if (statusError) {
                                            response.type = "Error";
                                            response.message = "Error in updating job status.";
                                            response.price = price;
                                            cb(null, response);
                                        }
                                        else {
                                            let toInsertData = { jobId: requestData.id, status: requestData.status, statusChangeddate: new Date().toUTCString(), is_active: 1 };
                                            Job.app.models.jobTrackerStatus.create(toInsertData, (finalError, finalSuccess) => {
                                                response.type = "Success";
                                                response.message = "Job Completed.";
                                                response.price = price;
                                                cb(null, response);
                                            })
                                        }
                                    })
                                })



                            }
                        })
                    }
                }
            })
        }
        else {
            const data9 = { status: requestData.status, id: requestData.id };
            Job.upsert(data9, (jobError, jobSuccess) => {
                Job.app.models.jobTrackerStatus.update({ jobId: requestData.id, is_active: 0 }, (statusError, statusSuccess) => {
                    if (statusError) {
                        response.type = "Error";
                        response.message = "Error in updating job status.";
                        cb(null, response);
                    }
                    else {
                        let toInsertData = { jobId: requestData.id, status: requestData.status, statusChangeddate: new Date().toUTCString(), is_active: 1 };
                        Job.app.models.jobTrackerStatus.create(toInsertData, (finalError, finalSuccess) => {
                            response.type = "Success";
                            response.message = "Job Completed.";
                            cb(null, response);
                        })
                    }
                })
            })
        }





        // var response = {};
        // Job.upsert(data, (err, res) => {
        //     if (err) {
        //         response.type = "Error";
        //         response.message = err;
        //         cb(null, response);
        //     }
        //     else {

        //         Job.app.models.Worker.findById(data.workerId, (err1, res1) => {
        //             if (err1) {
        //                 response.type = "Error";
        //                 response.message = err1;
        //                 cb(null, response);
        //             }
        //             else {
        //                 if (res1.deviceToken) {
        //                     let title; let body;
        //                     if (data.language == "en") {
        //                         title = "Your job is completed.";
        //                         body = "Thank  you for choosing for the service."
        //                     }
        //                     else if (data.language == "ar") {
        //                         title = "اكتملت وظيفتك.";
        //                         body = "شكرا لاختيارك للخدمة."
        //                     }
        //                     else if (data.language == "fr") {
        //                         title = "Votre travail est terminé.";
        //                         body = "Merci d'avoir choisi pour le service."
        //                     }
        //                     var message = {
        //                         to: res1.deviceToken,
        //                         data: {
        //                             "screenType": "JobDetails",
        //                             "jobId": data.id
        //                         },
        //                         notification: {
        //                             title: title,
        //                             body: body
        //                         }
        //                     };
        //                     let notificationInsertData = { notificationType: data.status, notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.customerId, jobId: data.id, IsToWorker: false, IsRead: 0 };
        //                     Job.app.models.Notifications.create(notificationInsertData, (notError, notSuccess) => {
        //                         fcm.send(message, function (err, fcmResponse) {
        //                             if (err) {
        //                                 response.type = "error";
        //                                 response.message = err;
        //                                 cb(null, response);
        //                             } else {
        //                                 Job.app.models.Service.findById(data.serviceId, (err2, res2) => {
        //                                     if (err2) {
        //                                         response.type = "Error";
        //                                         response.message = err2;
        //                                         cb(null, response);
        //                                     }
        //                                     else {
        //                                         var definedTime = res2.time_interval;
        //                                         var actualTime = Number(data.actualTime);
        //                                         var price;
        //                                         if (actualTime == res2.time_interval) {
        //                                             price = data.price;
        //                                         }
        //                                         else if (actualTime > res2.time_interval) {
        //                                             var noOfBrackets = actualTime / 15;
        //                                             var finalNoOfBrackets = Math.ceil(noOfBrackets);
        //                                             var chargePerHourForBracket = res2.cost_per_hour / 4;
        //                                             var finalCost = chargePerHourForBracket * finalNoOfBrackets;
        //                                             if (finalCost < res2.min_charge) {
        //                                                 finalCost = res2.min_charge;
        //                                             }
        //                                             price = finalCost;
        //                                         }
        //                                         else {
        //                                             var noOfBrackets = actualTime / 15;
        //                                             var finalNoOfBrackets = Math.ceil(noOfBrackets);
        //                                             var chargePerHourForBracket = res2.cost_per_hour / 4;
        //                                             var finalCost = chargePerHourForBracket * finalNoOfBrackets;
        //                                             if (finalCost < res2.min_charge) {
        //                                                 finalCost = res2.min_charge;
        //                                             }
        //                                             price = finalCost;
        //                                         }

        //                                         Job.app.models.jobTrackerStatus.update({ jobId: data.id, is_active: 0 }, (statusError, statusSuccess) => {
        //                                             if (statusError) {
        //                                                 response.type = "Error";
        //                                                 response.message = "Error in updating job status.";
        //                                                 response.price = price;
        //                                                 cb(null, response);
        //                                             }
        //                                             else {
        //                                                 let toInsertData = { jobId: data.id, status: data.status, statusChangeddate: new Date().toUTCString(), is_active: 1 };
        //                                                 Job.app.models.jobTrackerStatus.create(toInsertData, (finalError, finalSuccess) => {
        //                                                     response.type = "Success";
        //                                                     response.message = "Job Completed.";
        //                                                     response.price = price;
        //                                                     cb(null, response);
        //                                                 })
        //                                             }
        //                                         })


        //                                     }
        //                                 })

        //                             }
        //                         });
        //                     })

        //                 }
        //                 else {
        //                     response.type = "Success";
        //                     response.message = "Job Completd but couldn't inform customer";
        //                     cb(null, response);
        //                 }
        //             }
        //         })
        //     }
        // })


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
                                                let title;
                                                let body;
                                                if (customer[0].language) {
                                                    if (customer[0].language == "en") {
                                                        title = "Your job is being assigned.";
                                                        body = "Assigned By Admin."
                                                    }
                                                    else if (customer[0].language == "ar") {
                                                        title = "يتم تعيين وظيفتك.";
                                                        body = "تم التعيين بواسطة المسؤول"
                                                    }
                                                    else if (customer[0].language == "fr") {
                                                        title = "Votre travail est en cours d'affectation.";
                                                        body = "Assigné par Admin."
                                                    }
                                                }
                                                else {
                                                    title = "Your job is being assigned.";
                                                    body = "Assigned By Admin."

                                                }
                                                var message = {
                                                    to: customer[0].deviceToken,
                                                    data: {
                                                        "screenType": "AvailableJobs"
                                                    },
                                                    notification: {
                                                        title: title,
                                                        body: body
                                                    }
                                                };
                                                fcm1.send(message, function (err, fcmResponse) {
                                                    if (err) {
                                                        response.type = "error";
                                                        response.message = err;
                                                        cb(null, response);
                                                    } else {
                                                        title = '';
                                                        body = '';
                                                        if (worker[0].language) {
                                                            if (worker[0].language == "en") {
                                                                title = "You have been assigned a new job.";
                                                                body = "Assigned By Admin."
                                                            }
                                                            else if (worker[0].language == "ar") {
                                                                title = "لقد تم تعيين وظيفة جديدة لك.";
                                                                body = "تم التعيين بواسطة المسؤول"
                                                            }
                                                            else if (worker[0].language == "fr") {
                                                                title = "Vous avez été affecté à un nouvel emploi.";
                                                                body = "Assigné par Admin."
                                                            }
                                                        }
                                                        else {
                                                            title = "Your job is being assigned.";
                                                            body = "Assigned By Admin."

                                                        }
                                                        var message1 = {
                                                            to: worker[0].deviceToken,
                                                            data: {
                                                                "screenType": "AvailableJobs"
                                                            },
                                                            notification: {
                                                                title: title,
                                                                body: body
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
                            if (res[0].worker && res[0].worker.id) {
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
                                response.type = "Success";
                                response.message = res;
                                cb(null, response);
                            }



                        }
                        else {

                            if (res && res[0].worker) {
                                Job.app.models.favoriteSp.find({ where: { and: [{ workerId: res[0].worker.id }, { customerId: res[0].customer.id }] } }, (finalError, finalSuucess) => {
                                    if (finalError) {
                                        response.type = "Error";
                                        response.message = finalError;
                                        cb(null, response);
                                    }
                                    else {
                                        if (finalSuucess.length > 0) {
                                            for (let i = 0; i < finalSuucess.length; i++) {
                                                if (finalSuucess[i].customerId == res[0].customerId && finalSuucess[i].workerId == res[0].workerId) {
                                                    res[0].IsFavouriteWorker = true;
                                                    break;
                                                }
                                                else {
                                                    res[0].IsFavouriteWorker = false;
                                                }
                                            }
                                            // res[0].IsFavouriteWorker = true;
                                        }
                                        else {
                                            res[0].IsFavouriteWorker = false;
                                        }

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
                                })
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


    Job.followUpStart = function (data, cb) {
        var response = {};
        Job.findById(data.id, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                if (res) {
                    let toInsertData = { "jobStartTime": data.jobStartTime, "jobEndTime": data.jobEndTime, "price": data.price, "followUpDate": new Date(data.followUpDate).toUTCString(), "jobId": data.id, "customerId": res.customerId, "workerId": res.workerId, "currencyId": res.currencyId, "zoneId": res.zoneId, "serviceId": res.serviceId, "userLocationId": res.userLocationId, "jobMaterialId": data.jobMaterialId, hours: data.hours, status: "Pending" };
                    Job.app.models.jobFollowUp.create(toInsertData, (err1, res1) => {
                        if (err1) {
                            response.type = "Error";
                            response.message = err1;
                            cb(null, response);
                        }
                        else {
                            const expectedHours = Number(data.hours) * 60;
                            data.expectedTimeInterval = Number(data.expectedTimeInterval) + expectedHours;
                            let toUpdata = { id: data.id, status: "FOLLOWEDUP", expectedTimeInterval: data.expectedTimeInterval };
                            Job.upsert(toUpdata, (err2, res2) => {
                                if (err2) {
                                    response.type = "Error";
                                    response.message = err2;
                                    cb(null, response);
                                }
                                else {
                                    Job.app.models.Customer.findById(res.customerId, (err3, res3) => {
                                        if (err3) {
                                            response.type = "Error";
                                            response.message = err3;
                                            cb(null, response);
                                        }
                                        else {
                                            if (res3.deviceToken) {
                                                var message = {
                                                    to: res3.deviceToken,
                                                    data: {
                                                        "screenType": "JobDetails",
                                                        "jobId": data.id
                                                    },
                                                    notification: {
                                                        title: "Your Job is being followed up.",
                                                        body: "Your Job is being followed up."
                                                    }
                                                };
                                                let notificationInsertData = { notificationType: "JOBFOLLOWEDUP", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: res.customerId, jobId: data.id, IsToWorker: false, IsRead: 0 };
                                                Job.app.models.Notifications.create(notificationInsertData, (notError, notSuccess) => {
                                                    fcm1.send(message, function (err4, fcmResponse) {
                                                        if (err4) {
                                                            response.type = "Success";
                                                            response.message = "Job followed up successfully.";
                                                            cb(null, response);
                                                        } else {
                                                            response.type = "Success";
                                                            response.message = "Job followed up successfully.";
                                                            cb(null, response);
                                                        }
                                                    });
                                                })

                                            }
                                            else {
                                                response.type = "Success";
                                                response.message = "Job Followed Up Successfully but could not notify customer.";
                                                cb(null, response);
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    response.type = "Error";
                    response.message = "No job found.";
                    cb(null, response);
                }

            }
        })
    }

    Job.remoteMethod('followUpStart', {
        http: {
            path: '/followUpStart',
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



    Job.calculatePromoPrice = function (data, cb) {
        var respone = {};
        Job.app.models.promoLog.find({ where: { customerId: data.customerId, promotionsId: data.promotionsId } }, (firstError, firstSuccess) => {
            if (firstError) {
                respone.type = "Error";
                respone.message = firstError;
                cb(null, respone);
            }
            else {
                if (firstSuccess.length > 0) {
                    respone.type = "Success";
                    respone.IsPromoApplied = false;
                    respone.price = data.price;
                    respone.message = "You have already used this promo.";
                    cb(null, respone);
                }
                else {
                    if (data.IsFirstOrderOnly) {
                        Job.find({ where: { customerId: data.customerId } }, (err, res) => {
                            if (err) {
                                respone.type = "Error";
                                respone.message = err;
                                cb(null, respone);
                            }
                            else {
                                if (res.length > 0) {
                                    respone.type = "Success";
                                    respone.IsPromoApplied = false;
                                    respone.price = data.price;
                                    cb(null, respone);
                                }
                                else {
                                    Job.app.models.promotionsService.find({ where: { promotionsId: data.promotionsId } }, (err1, res1) => {
                                        if (res1.length && res1.length > 0) {
                                            if (res1[0].serviceId == data.serviceId) {
                                                let nowDate = new Date();
                                                nowDate.setHours(0, 0, 0, 0, 0);
                                                data.start_date = new Date(data.start_date);
                                                data.start_date.setHours(0, 0, 0, 0, 0);
                                                data.end_date = new Date(data.end_date);
                                                data.end_date.setHours(0, 0, 0, 0, 0);
                                                if (nowDate >= data.start_date && nowDate < data.end_date) {
                                                    if (Number(data.NoOfUsed) < Number(data.noOfUses)) {
                                                        if (Number(data.price) > Number(data.min_order_amount)) {
                                                            if (Number(data.price) < Number(data.max_discount_amount)) {
                                                                if (data.time_interval >= data.jobEstimatedHours) {
                                                                    let finalPrice = Number(data.price) - Number(data.amount);
                                                                    if (finalPrice > Number(data.min_charge)) {

                                                                    }
                                                                    else {
                                                                        finalPrice = Number(data.min_charge);
                                                                    }
                                                                    const toUpdatePromo = { id: data.promotionsId, NoOfUsed: data.NoOfUsed + 1 };
                                                                    Job.app.models.promotions.upsert(toUpdatePromo, (err4, res4) => {
                                                                        const promoLogData = { customerId: data.customerId, promotionsId: data.promotionsId, price: data.price };
                                                                        Job.app.models.promoLog.create(promoLogData, (err5, res5) => {
                                                                            respone.type = "Success";
                                                                            respone.IsPromoApplied = true;
                                                                            respone.price = finalPrice;
                                                                            respone.message = "Promo applied."
                                                                            cb(null, respone);
                                                                        })
                                                                    })
                                                                }
                                                                else {
                                                                    respone.type = "Success";
                                                                    respone.IsPromoApplied = false;
                                                                    respone.price = data.price;
                                                                    respone.promoPrice = data.amount;
                                                                    respone.message = "Promo code not valid for the mentioned time."
                                                                    cb(null, respone);
                                                                }

                                                            }
                                                            else {
                                                                respone.type = "Success";
                                                                respone.IsPromoApplied = false;
                                                                respone.price = data.price;
                                                                respone.message = "Price is more than maximum discount amount."
                                                                cb(null, respone);
                                                            }


                                                        }
                                                        else {
                                                            respone.type = "Success";
                                                            respone.IsPromoApplied = false;
                                                            respone.price = data.price;
                                                            respone.message = "Minimum Price is less."
                                                            cb(null, respone);
                                                        }
                                                    }
                                                    else {
                                                        respone.type = "Success";
                                                        respone.IsPromoApplied = false;
                                                        respone.price = data.price;
                                                        respone.message = "Maximum used count for promo reached."
                                                        cb(null, respone);
                                                    }

                                                }
                                                else {
                                                    respone.type = "Success";
                                                    respone.IsPromoApplied = false;
                                                    respone.price = data.price;
                                                    respone.message = "Promo code expired."
                                                    cb(null, respone);
                                                }
                                            }
                                            else {
                                                respone.type = "Success";
                                                respone.IsPromoApplied = false;
                                                respone.price = data.price;
                                                respone.message = "This promo is not applicable for the selected service."
                                                cb(null, respone);
                                            }
                                        }
                                        else {
                                            respone.type = "Success";
                                            respone.IsPromoApplied = false;
                                            respone.price = data.price;
                                            cb(null, respone);
                                        }
                                    })
                                }
                            }
                        })
                    }
                    else {
                        Job.app.models.promotionsService.find({ where: { promotionsId: data.promotionsId } }, (err1, res1) => {
                            if (res1.length && res1.length > 0) {
                                if (res1[0].serviceId == data.serviceId) {
                                    let nowDate = new Date();
                                    nowDate.setHours(0, 0, 0, 0, 0);
                                    data.start_date = new Date(data.start_date);
                                    data.start_date.setHours(0, 0, 0, 0, 0);
                                    data.end_date = new Date(data.end_date);
                                    data.end_date.setHours(0, 0, 0, 0, 0);
                                    if (nowDate >= data.start_date && nowDate < data.end_date) {
                                        if (Number(data.NoOfUsed) < Number(data.noOfUses)) {
                                            if (Number(data.price) > Number(data.min_order_amount)) {
                                                if (Number(data.price) < Number(data.max_discount_amount)) {
                                                    if (data.time_interval >= data.jobEstimatedHours) {
                                                        let finalPrice = Number(data.price) - Number(data.amount);
                                                        if (finalPrice > Number(data.min_charge)) {

                                                        }
                                                        else {
                                                            finalPrice = Number(data.min_charge);
                                                        }
                                                        const toUpdatePromo = { id: data.promotionsId, NoOfUsed: data.NoOfUsed + 1 };
                                                        Job.app.models.promotions.upsert(toUpdatePromo, (err4, res4) => {
                                                            const promoLogData = { customerId: data.customerId, promotionsId: data.promotionsId, price: data.price };
                                                            Job.app.models.promoLog.create(promoLogData, (err5, res5) => {
                                                                respone.type = "Success";
                                                                respone.IsPromoApplied = true;
                                                                respone.price = finalPrice;
                                                                respone.promoPrice = data.amount;
                                                                respone.message = "Promo applied."
                                                                cb(null, respone);
                                                            })
                                                        })
                                                    }
                                                    else {
                                                        respone.type = "Success";
                                                        respone.IsPromoApplied = false;
                                                        respone.price = data.price;
                                                        respone.message = "Promo code not valid for the mentioned time."
                                                        cb(null, respone);
                                                    }

                                                }
                                                else {
                                                    respone.type = "Success";
                                                    respone.IsPromoApplied = false;
                                                    respone.price = data.price;
                                                    respone.message = "Price is more than maximum discount amount."
                                                    cb(null, respone);
                                                }


                                            }
                                            else {
                                                respone.type = "Success";
                                                respone.IsPromoApplied = false;
                                                respone.price = data.price;
                                                respone.message = "Minimum Price is less."
                                                cb(null, respone);
                                            }
                                        }
                                        else {
                                            respone.type = "Success";
                                            respone.IsPromoApplied = false;
                                            respone.price = data.price;
                                            respone.message = "Maximum used count for promo reached."
                                            cb(null, respone);
                                        }

                                    }
                                    else {
                                        respone.type = "Success";
                                        respone.IsPromoApplied = false;
                                        respone.price = data.price;
                                        respone.message = "Promo code expired."
                                        cb(null, respone);
                                    }



                                }
                                else {
                                    respone.type = "Success";
                                    respone.IsPromoApplied = false;
                                    respone.price = data.price;
                                    respone.message = "This promo is not applicable for the selected service."
                                    cb(null, respone);
                                }
                            }
                            else {
                                respone.type = "Success";
                                respone.IsPromoApplied = false;
                                respone.price = data.price;
                                cb(null, respone);
                            }
                        })
                    }
                }
            }
        })

    }

    Job.remoteMethod('calculatePromoPrice', {
        http: {
            path: '/calculatePromoPrice',
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






}                                         