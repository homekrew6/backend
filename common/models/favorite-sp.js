'use strict';
var FCM = require('fcm-push');
var workerServerKey = 'AIzaSyDXBq375kG8CSjsKeX11EmtQWCmyQ14ATE';
var fcm = new FCM(workerServerKey);
module.exports = function (Favoritesp) {


    Favoritesp.addSpAsFavourite = function (data, cb) {
        var response = {};
        const toInsertDate = { "customerId": data.customerId, "workerId": data.workerId };
        Favoritesp.app.models.Worker.findById(data.workerId, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                if (res) {
                    Favoritesp.create(toInsertDate, (err1, res1) => {
                        if (err1) {
                            response.type = "Error";
                            response.message = err1;
                            cb(null, response);
                        }
                        else {
                            if (res.deviceToken) {
                                var message = {
                                    to: res.deviceToken,
                                    data: {
                                        "screenType": "Menu"
                                    },
                                    notification: {
                                        title: "You have been added as Favourite SP.",
                                        body: "You have been added as Favourite SP."
                                    }
                                };
                                const notificationInsertData = { notificationType: "FavSp", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: data.workerId, jobId: '', IsToWorker: true, IsRead: 0 };
                                Favoritesp.app.models.Notifications.create(notificationInsertData, (finalError, finalSuccess)=>{
                                    if(finalError)
                                    {
                                        response.type="Error";
                                        response.message=finalError;
                                        cb(null, response);
                                    }
                                    else{
                                        fcm.send(message, function (err, fcmResponse) {
                                            if (err) {
                                                response.type = "Success";
                                                response.message = "Successfully added in the favourite list.";
                                                cb(null, response);
                                            } else {
                                                response.type = "Success";
                                                response.message = "Successfully added in the favourite list.";
                                                cb(null, response);
                                            }
                                        });
                                    }
                                })
                               
                            }
                            else
                            {
                                response.type = "Success";
                                response.message = "Successfully added in the favourite list.";
                                cb(null, response);
                            }
                        }
                    })
                }
                else {
                    response.type = "Error";
                    response.message = "No worker Found.";
                    cb(null, response);
                }
            }


        });

    }
    Favoritesp.remoteMethod('addSpAsFavourite', {
        http: {
            path: '/addSpAsFavourite',
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


    Favoritesp.removeSpAsFavourite = function (data, cb) {
        var response = {};
        Favoritesp.remove({where:{workerId:data.workerId, customerId:data.customerId}}, (err1, res1) => {
            if (err1) {
                response.type = "Error";
                response.message = err1;
                cb(null, response);
            }
            else {
                response.type = "Success";
                response.message = "Successfully removed from the favourite list.";
                cb(null, response);
            }
        })

    }
    Favoritesp.remoteMethod('removeSpAsFavourite', {
        http: {
            path: '/removeSpAsFavourite',
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
};
