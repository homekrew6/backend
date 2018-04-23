'use strict';

module.exports = function(Notifications) {

    Notifications.getNotificationListByIdForWorker=function(data, cb){
        var response={};
        Notifications.find({where:{sentIds:data.workerId, IsToWorker:1}}, (err, res)=>{
            if(err)
            {
                response.type="Error";
                response.message=err;
                cb(null, response);
            }
            else
            {
                response.type="Success";
                response.message=res;
                cb(null, response);
            }
        })
    }

    Notifications.remoteMethod('getNotificationListByIdForWorker', {
        http: { path: '/getNotificationListByIdForWorker', verb: 'post' },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });

    Notifications.getNotificationListByIdForCustomer = function (data, cb) {
        var response = {};
        Notifications.find({ where: { sentIds: data.customerId, IsToWorker: 0 } }, (err, res) => {
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
        })
    }

    Notifications.remoteMethod('getNotificationListByIdForCustomer', {
        http: { path: '/getNotificationListByIdForCustomer', verb: 'post' },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });


    

    Notifications.getUnreadCustomerNot = function (data, cb) {
        var response = {};
        Notifications.find({ where: { sentIds: data.customerId, IsToWorker: 0, IsRead:0 } }, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                response.type = "Success";
                response.message = res.length;
                cb(null, response);
            }
        })
    }

    Notifications.remoteMethod('getUnreadCustomerNot', {
        http: { path: '/getUnreadCustomerNot', verb: 'post' },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });

    Notifications.getUnreadWorkerNot = function (data, cb) {
        var response = {};
        Notifications.find({ where: { sentIds: data.workerId, IsToWorker: 1, IsRead: 0 } }, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                response.type = "Success";
                response.message = res.length;
                cb(null, response);
            }
        })
    }

    Notifications.remoteMethod('getUnreadWorkerNot', {
        http: { path: '/getUnreadWorkerNot', verb: 'post' },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });
    Notifications.updateCustomerUnReadNot = function (data, cb) {
        var response = {};
        const toUpdateData={sentIds:data.customerId, IsRead:1, id:data.id};
        Notifications.update(toUpdateData, (err, res)=>{
            if(err)
            {
                response.type="Error";
                response.message=err;
                cb(null, response);
            }
            else
            {
                response.type = "Success";
                response.message = res;
                cb(null, response);
            }
        })
    }

    Notifications.remoteMethod('updateCustomerUnReadNot', {
        http: { path: '/updateCustomerUnReadNot', verb: 'post' },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });


    Notifications.updateWorkerUnReadNot = function (data, cb) {
        var response = {};
        const toUpdateData = { sentIds: data.workerId, IsRead: 1, id: data.id };
        Notifications.update(toUpdateData, (err, res) => {
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
        })
    }
    Notifications.remoteMethod('updateWorkerUnReadNot', {
        http: { path: '/updateWorkerUnReadNot', verb: 'post' },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });
    Notifications.clearAllNotificationByCustomerId = function (data, cb) {
        var response = {};
      
        Notifications.remove({sentIds:data.customerId}, (err, res) => {
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
        })
    }

    Notifications.remoteMethod('clearAllNotificationByCustomerId', {
        http: { path: '/clearAllNotificationByCustomerId', verb: 'post' },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });



    Notifications.clearAllNotificationByWorkerId = function (data, cb) {
        var response = {};
      
        Notifications.remove({sentIds:data.workerId}, (err, res) => {
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
        })
    }


    Notifications.remoteMethod('clearAllNotificationByWorkerId', {
        http: { path: '/clearAllNotificationByWorkerId', verb: 'post' },
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
