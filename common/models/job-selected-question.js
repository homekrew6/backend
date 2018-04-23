'use strict';

module.exports = function(Jobselectedquestion) {

    Jobselectedquestion.getJobSelectedAnswerList=function(data,cb){
        var response={};
    Jobselectedquestion.find({where:{jobId:data.id}}, (err, res)=>{
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

    Jobselectedquestion.remoteMethod('getJobSelectedAnswerList', {
        http: {
            path: '/getJobSelectedAnswerList',
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
