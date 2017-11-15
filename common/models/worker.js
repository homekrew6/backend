'use strict';

module.exports = function(Worker) {
  Worker.editWorker = function(id,worker,cb){
    worker.id = id;
    Worker.upsert( worker, function (err, res) {
        cb(null, res);
    });
  }
  Worker.remoteMethod('editWorker', {
          http: {path: '/editWorker/:id', verb: 'put'},
           accepts: [
            {arg: 'id', type: 'number',required:true},
            {
              arg: 'worker',
              type: 'object',
              http:{source:'body'}
            }
          ],
            returns: {arg: 'worker', type: 'object'}
    });
};
