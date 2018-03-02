'use strict';

module.exports = function(Question) {
  Question.getQuestions = function(cb){


    var filter = {
      where: {parent_id: 0},
      include: ['service']
    };

    return Question.find(filter).then(function(empl) {

     return empl;
   }).catch(function(err) {
     console.log(err);
   });
  }
  Question.remoteMethod('getQuestions', {
          http: {path: '/getQuestions', verb: 'get'},

            returns: {arg: 'question', type: 'array'}
    });
};
