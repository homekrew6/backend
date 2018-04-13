'use strict';

module.exports = function(Jobtrackerstatus) {
    Jobtrackerstatus.getJobTrackingDetailsById = function (data, cb) {
        var response = {};
        Jobtrackerstatus.find({jobId:data.id}, (err, success)=>{
            if(err)
            {
                response.type="Error";
                response.message=err;
                cb(null, response);
            }
            else
            {
                response.type="Success";
                response.message=success;
                cb(null, response);
            }
        })
    }

    Jobtrackerstatus.remoteMethod('getJobTrackingDetailsById', {
        http: {
            path: '/getJobTrackingDetailsById',
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
