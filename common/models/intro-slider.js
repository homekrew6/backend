'use strict';

module.exports = function(Introslider) {
  Introslider.getSliders = function(iconslider,cb){
    console.log(iconslider);
    Introslider.find({where: {type: iconslider.type}}, function(err, res) {
        if(!err){
          cb(null,res);

        }else{
          cb(err);
        }
    });
  }
  Introslider.remoteMethod('getSliders', {
      http: {path: '/getSliders', verb: 'post'},
       accepts: [
        {
          arg: 'slider',
          type: 'object',
          http:{source:'body'}
        }
      ],
        returns: {arg: 'response', type: 'object'}
    });
};
