'use strict';
var FCM = require('fcm-push');
var userServerKey_before_release = 'AIzaSyDXBq375kG8CSjsKeX11EmtQWCmyQ14ATE';
var userServerKey = "AIzaSyDPsQQvaMIUWiL0jb_ftvKlM4OV_IFzZkw";
var fcm1 = new FCM(userServerKey);
module.exports = function (Promotions) {


    Promotions.checkIfThePriorityIsValid = function (data, cb) {
        var response = {};
        data.priority = Number(data.priority);
        Promotions.find({ where: { IsValid: 1 } }, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                var IsPriorityValid = true;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].priority > data.priority || res[i].priority < data.priority) {

                    }
                    else {
                        if(data.id)
                        {
                            if (data.id == res[i].id)
                            {

                            }
                            else
                            {
                                IsPriorityValid = false;
                                break;
                            }
                        }
                        else
                        {
                            IsPriorityValid = false;
                            break;
                        }
                     
                    }
                }
                response.type = "Success";
                response.message = IsPriorityValid;
                cb(null, response);
            }
        });

    }
    Promotions.remoteMethod('checkIfThePriorityIsValid', {
        http: {
            path: '/checkIfThePriorityIsValid',
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




    Promotions.addPromoCode = function (data, cb) {
        var response = {};
        const toInsertData = {
            start_date: data.start_date, end_date: data.end_date, jobEstimatedHours: data.jobEstimatedHours, type: data.type,
            amount: data.amount, priority: data.priority, IsFirstOrderOnly: data.IsFirstOrderOnly, min_order_amount: data.min_order_amount,
            max_discount_amount: data.max_discount_amount, coupon_count: data.coupon_count, noOfUses: data.noOfUses, Labour: data.Labour, promo_code: data.promo_code, issue_date: new Date(), IsValid: 1
        };

        Promotions.create(toInsertData, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                var entryData = [];
                for (var i = 0; i < data['serviceIds'].length; i++) {

                    let insertData = { "promotionsId": res.id, "serviceId": data['serviceIds'][i].id };
                    entryData.push(insertData);

                }
                Promotions.app.models.promotionsService.create(entryData, (serviceError, serviceSuccess) => {
                    if (serviceError) {
                        response.type = "Error";
                        response.message = serviceError;
                        cb(null, response);
                    }
                    else {
                        entryData = [];
                        if(data['customerIds'])
                        {
                            for (var i = 0; i < data['customerIds'].length; i++) {

                                let insertData = { "promotionsId": res.id, "customerId": data['customerIds'][i].id };
                                entryData.push(insertData);

                            }
                            Promotions.app.models.promotionsCustomer.create(entryData, (customerError, customerSuccess) => {
                                if (customerError) {
                                    response.type = "Error";
                                    response.message = customerError;
                                    cb(null, response);
                                }
                                else {
                                    let registrationIds = [];
                                    let toSentIds = [];
                                    Promotions.app.models.Customer.find({}, (finalError, finalSuccess) => {
                                        if (finalError) {
                                            response.type = "Error";
                                            response.message = finalError;
                                            cb(null, response);
                                        }
                                        else {
                                            for (let i = 0; i < finalSuccess.length; i++) {
                                                if (finalSuccess[i].deviceToken) {
                                                    registrationIds.push(finalSuccess[i].deviceToken);
                                                    toSentIds.push(finalSuccess[i].id);
                                                }
                                            }
                                            var message = {
                                                registration_ids: registrationIds,
                                                data: {
                                                    "screenType": "Notifications"
                                                },
                                                notification: {
                                                    title: "New Promo Code",
                                                    body: "New Promo Code"
                                                }
                                            };
                                            var entryData1 = [];
                                            for (var k = 0; k < toSentIds.length; k++) {
                                                let insertData = { notificationType: "NewPromo", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: toSentIds[k], jobId: '', IsToWorker: false, IsRead: 0 };
                                                entryData1.push(insertData);
                                            }

                                            Promotions.app.models.Notifications.create(entryData1, (finalError1, finalSuccess1) => {
                                                fcm1.send(message, function (err, fcmResponse) {
                                                    response.type = "Success";
                                                    response.message = "Promo Code added successfully.";
                                                    cb(null, response);
                                                });
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        else
                        {
                            response.type = "Success";
                            response.message = "Promo Code added successfully.";
                            cb(null, response);
                        }
                       
                    }
                })
            }
        })


    }
    Promotions.remoteMethod('addPromoCode', {
        http: {
            path: '/addPromoCode',
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



    Promotions.editPromocode = function (data, cb) {
        var response = {};

        let serviceIds = data.serviceIds;
        delete data.serviceIds;

        let customerIds = data.customerIds;
        delete data.customerIds




        Promotions.upsert(data, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                var entryData = [];
                for (var i = 0; i < serviceIds.length; i++) {

                    let insertData = { "promotionsId": data.id, "serviceId": serviceIds[i].id };
                    entryData.push(insertData);

                }
                Promotions.app.models.promotionsCustomer.remove({ where: { promotionsId: data.id } }, (customerRemoveError, customerRemoveSuccess) => {
                    if (customerRemoveError) {
                        response.type = "Error";
                        response.message = customerRemoveError;
                        cb(null, response);
                    }
                    else {
                        Promotions.app.models.promotionsService.remove({ where: { promotionsId: data.id } }, (serviceRemoveError, serviceRemoveSuccess) => {
                            if (serviceRemoveError) {
                                response.type = "Error";
                                response.message = serviceRemoveError;
                                cb(null, response);
                            }
                            else {
                                Promotions.app.models.promotionsService.create(entryData, (serviceError, serviceSuccess) => {
                                    if (serviceError) {
                                        response.type = "Error";
                                        response.message = serviceError;
                                        cb(null, response);
                                    }
                                    else {
                                        entryData = [];
                                        for (var i = 0; i < customerIds.length; i++) {

                                            let insertData = { "promotionsId": data.id, "customerId": customerIds[i].id };
                                            entryData.push(insertData);

                                        }

                                        Promotions.app.models.promotionsCustomer.create(entryData, (customerError, customerSuccess) => {
                                            if (customerError) {
                                                response.type = "Error";
                                                response.message = customerError;
                                                cb(null, response);
                                            }
                                            else {
                                                response.type = "Success";
                                                response.message = "Promotion added successfully.";
                                                cb(null, response);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })

            }
        })


    }
    Promotions.remoteMethod('editPromocode', {
        http: {
            path: '/editPromocode',
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
