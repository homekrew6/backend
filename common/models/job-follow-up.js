'use strict';
var FCM = require('fcm-push');
var workerServerKey_before_release = 'AIzaSyDXBq375kG8CSjsKeX11EmtQWCmyQ14ATE';
var workerServerKey = "AIzaSyDPsQQvaMIUWiL0jb_ftvKlM4OV_IFzZkw";
var fcm = new FCM(workerServerKey);
module.exports = function (Jobfollowup) {

    Jobfollowup.acceptFollowUp = function (data, cb) {
        var response = {};


        Jobfollowup.remove({ where: { id: data.id } }, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                var toUpdateData = { id: data.jobId, price: data.price, status: "ACCEPTED", postedDate: new Date(data.followupDate).toUTCString() };
                Jobfollowup.app.models.Job.upsert(toUpdateData, (err1, res1) => {
                    if (err1) {
                        response.type = "Error";
                        response.message = err1;
                        cb(null, response);
                    }
                    else {
                        var message = {
                            to: data.deviceToken,
                            data: {
                                "screenType": "JobDetails",
                                "jobId": data.jobId
                            },
                            notification: {
                                title: "Job Follow Up Accepted.",
                                body: "Job Follow Up Accepted."
                            }
                        };
                        const notificationInsertData = { IsRead: 0, notificationType: "JobFollowUp", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.workerId, jobId: data.jobId, IsToWorker: true };

                        Jobfollowup.app.models.Notifications.create(notificationInsertData, (err2, res2) => {
                            if (err2) {
                                response.type = "Error";
                                response.message = err2;
                                cb(null, response);
                            }
                            else {

                                fcm.send(message, function (err4, fcmResponse) {
                                    if (err4) {
                                        response.type = "success";
                                        response.message = "Job Followed up successfully.";
                                        cb(null, response);
                                    } else {
                                        response.type = "success";
                                        response.message = "Job Followed up successfully.";
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

    Jobfollowup.remoteMethod('acceptFollowUp', {
        http: {
            path: '/acceptFollowUp',
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


    Jobfollowup.declineFollowUp = function (data, cb) {
        var response = {};
        var toUpdateData = { id: data.id, status: "Rejected" };
        Jobfollowup.upsert(toUpdateData, (err1, res1) => {
            if (err1) {
                response.type = "Error";
                response.message = err1;
                cb(null, response);
            }
            else {
                var message = {
                    to: data.deviceToken,
                    data: {
                        "screenType": "AvailableJobs"
                    },
                    notification: {
                        title: "Job Follow Up Declined.",
                        body: "Job Follow Up Declined."
                    }
                };
                const notificationInsertData = { notificationType: "JobFollowUpReject", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.workerId, jobId: data.jobId, IsToWorker: true, IsRead: 0 };
                const jobUpdateStatus = { id: data.jobId, status: "PAYPENDING" };
                Jobfollowup.app.models.Job.upsert(jobUpdateStatus, (err4, res4) => {
                    if (err4) {
                        response.type = "Error";
                        response.message = err4;
                        cb(null, response);
                    }
                    else {
                        Jobfollowup.app.models.Notifications.create(notificationInsertData, (err2, res2) => {
                            if (err2) {
                                response.type = "Error";
                                response.message = err2;
                                cb(null, response);
                            }
                            else {
                                fcm.send(message, function (err, fcmResponse) {
                                    if (err) {
                                        response.type = "success";
                                        response.message = "Job Followed up declined successfully.";
                                        cb(null, response);
                                    } else {
                                        response.type = "success";
                                        response.message = "Job Followed up declined successfully.";
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

    Jobfollowup.remoteMethod('declineFollowUp', {
        http: {
            path: '/declineFollowUp',
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
};
